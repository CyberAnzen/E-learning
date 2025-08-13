const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

function generateInviteCode() {
  return uuidv4().split("-")[0]; // short code like 'a3f1b2'
}

const TeamSchema = new Schema(
  {
    teamName: { type: String, required: true, unique: true, index: true },
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Count words by splitting on whitespace and filtering out empties
          const wordCount = value.trim().split(/\s+/).length;
          return wordCount <= 200;
        },
        message: "Description must not exceed 200 words.",
      },
    },
    teamLeader: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "teamLeader is required"],
      validate: {
        validator: async function (value) {
          const Team = mongoose.model("Teams");
          const existingTeam = await Team.findOne({
            $or: [{ teamLeader: value }, { "teamMembers.userId": value }],
            _id: { $ne: this._id },
          });
          return !existingTeam;
        },
        message: "User is already in another team.",
      },
    },
    invites: [
      {
        memeberId: {
          type: Schema.Types.ObjectId,
          ref: "Users",
          required: [true, "teamLeader is required"],
          validate: {
            validator: async function (value) {
              const Team = mongoose.model("Teams");
              const existingTeam = await Team.findOne({
                $or: [{ teamLeader: value }, { "teamMembers.userId": value }],
                _id: { $ne: this._id },
              });
              return !existingTeam;
            },
            message: "User is already in another team.",
          },
          code: { type: String, default: generateInviteCode, unique: true },
        },
      },
    ],

    teamMembers: {
      type: [
        new Schema(
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: "Users",
              required: [true, "userId is required"],
              index: true,
              validate: [
                {
                  validator: async function (value) {
                    const User = mongoose.model("Users");
                    const userExists = await User.exists({ _id: value });
                    return !!userExists;
                  },
                  message: "User does not exist.",
                },
                {
                  validator: async function (value) {
                    const Team = mongoose.model("Teams");
                    const existingTeam = await Team.findOne({
                      $or: [
                        { "teamMembers.userId": value },
                        { teamLeader: value },
                      ],
                      _id: { $ne: this.parent().parent()._id },
                    });
                    return !existingTeam;
                  },
                  message: "User is already in another team.",
                },
              ],
            },
            timestamp: { type: Date, default: Date.now },
          },
          { _id: false }
        ),
      ],
      validate: [
        {
          validator: (v) => v.length >= 1,
          message: "Team must have at least 1 member.",
        },
        {
          validator: (v) => v.length <= 5,
          message: "Team members cannot exceed 5.",
        },
        {
          validator: (v) =>
            v.length === new Set(v.map((m) => m.userId.toString())).size,
          message: "Duplicate members are not allowed in the same team.",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// TeamSchema.index({ teamName: 1 }, { unique: true });

TeamSchema.statics.createTeam = async function (teamName, description, UserId) {
  const User = mongoose.model("Users");

  const leader = await User.findById(UserId);
  if (!leader) throw new Error("Leader user not found");
  // if (leader.teamId != null)
  //   // covers both null and undefined
  //   throw new Error("Leader already belongs to a team");

  const team = await this.create({
    teamName,
    teamMembers: [{ userId: UserId }],
    description,
    teamLeader: UserId,
  });

  await User.UpdateTeamId(team._id, UserId, true);

  return await this.findById(team._id).populate(
    "teamMembers.userId teamLeader"
  );
};
TeamSchema.statics.deleteTeam = async function (teamId, userId) {
  const User = mongoose.model("Users");
  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    throw new Error("Invalid team ID");
  }
  const team = await this.findById(teamId);
  if (!team) throw new Error("Team not found");

  if (team.teamLeader.toString() !== userId.toString()) {
    throw new Error("Only the team leader can delete the team");
  }

  await User.updateMany({ teamId }, { $unset: { teamId: "" } });
  await this.findByIdAndDelete(teamId);

  return { message: "Team deleted successfully" };
};

TeamSchema.statics.updateMembers = async function (teamId, leaderId, members) {
  if (!teamId || !members || !Array.isArray(members)) {
    throw new Error("Invalid request data");
  }

  const team = await this.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  if (team.teamLeader.toString() !== leaderId) {
    throw new Error("Only team leader can update members");
  }

  const normalizedMembers = members.map((m) =>
    typeof m === "string" ? { userId: m } : { userId: m.userId }
  );

  const cleanedUpdatedMembers = normalizedMembers
    .filter((m) => m.userId && mongoose.Types.ObjectId.isValid(m.userId))
    .map((m) => ({ userId: new mongoose.Types.ObjectId(m.userId) }));

  if (cleanedUpdatedMembers.length < 1) {
    throw new Error("Team must have at least 1 member");
  }

  const newMemberIds = cleanedUpdatedMembers.map((m) => m.userId.toString());

  if (!newMemberIds.includes(team.teamLeader.toString())) {
    throw new Error("Team leader must be in the team");
  }

  const prevMemberIds = (team.teamMembers || []).map((m) =>
    m.userId.toString()
  );

  const toAdd = newMemberIds.filter((id) => !prevMemberIds.includes(id));
  const toRemove = prevMemberIds.filter((id) => !newMemberIds.includes(id));

  team.teamMembers = cleanedUpdatedMembers;
  await team.save();

  if (toAdd.length > 0) {
    await mongoose.model("Users").updateMany(
      { _id: { $in: toAdd }, teamId: null }, // only update if teamId is null
      { $set: { teamId: team._id } }
    );
  }

  if (toRemove.length > 0) {
    await mongoose.model("Users").updateMany(
      { _id: { $in: toRemove }, teamId: team._id }, // only clear if they belong to this team
      { $set: { teamId: null } }
    );
  }

  if (!prevMemberIds.includes(team.teamLeader.toString())) {
    await mongoose
      .model("Users")
      .updateOne(
        { _id: team.teamLeader, teamId: null },
        { $set: { teamId: team._id } }
      );
  }

  return await this.findById(teamId).populate({
    path: "teamMembers.userId teamLeader",
  });
};

// Method for leader to invite a user
TeamSchema.statics.inviteMember = async function (teamId, leaderId, memberId) {
  if (!teamId || !leaderId || !memberId) {
    throw new Error("Team ID, Leader ID, and Member ID are required");
  }

  const team = await this.findById(teamId);
  if (!team) throw new Error("Team not found");

  if (team.teamLeader.toString() !== leaderId.toString()) {
    throw new Error("Only the team leader can invite members");
  }

  const inviteCode = generateInviteCode();

  // Add to invites array
  team.invites.push({ memberId, code: inviteCode });
  await team.save();

  return { memberId, inviteCode };
};
// Method for the leader to revoke a user
TeamSchema.statics.revokeInvite = async function (teamId, leaderId, memberId) {
  if (!teamId || !leaderId || !memberId) {
    throw new Error("Team ID, Leader ID, and Member ID are required");
  }

  const team = await this.findById(teamId);
  if (!team) throw new Error("Team not found");

  if (team.teamLeader.toString() !== leaderId.toString()) {
    throw new Error("Only the team leader can revoke invites");
  }

  // Remove all invites for that member
  const originalLength = team.invites.length;
  team.invites = team.invites.filter(
    (invite) => invite.memberId.toString() !== memberId.toString()
  );

  if (team.invites.length === originalLength) {
    throw new Error("Invite not found for this member");
  }

  await team.save();

  return { memberId, revoked: true };
};

module.exports = mongoose.model("Teams", TeamSchema);
