const fs = require('fs');
const path = require('path');
const customError = require("../../utilies/customError")
const jsonPath = path.join( process.cwd(),'config/avatorNames.json');

const fetchDefaultAvator = async () => {
  try {
    if (!fs.existsSync(jsonPath)) {
        throw new customError("No jsonfile found", 404);
    }

    const data = fs.readFileSync(jsonPath, 'utf8');
    let avators = JSON.parse(data);
    if (avators.length === 0) {
      throw new customError("No avatars available", 404);
    }
    return {
      data:avators,
      success:true
    }
  } catch (error) {
     console.error("[cacheManager => fetcher] Failed to fetch default avator for caching:", error.error || error.message);
    
     if (error instanceof customError) {
        return {
            success: false,
            statusCode: error.statusCode,
            message: error.message,
            error: error.error || "Unknown error"
        };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch default avators",
      error: error.message || "Unknown error"
    };
  }
};

module.exports = fetchDefaultAvator;