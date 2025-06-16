const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const fsSync = require("fs");

async function convertToWebP(fileName, inputPath, outputPath,deleteOriginal = true) {
    let convertedImages = [];
    let unconvertedImages = [];
    inputPath = path.join(process.cwd(), inputPath);
    outputPath = path.join(process.cwd(), outputPath);    
    console.log("Input Path:", inputPath);
    console.log("Output Path:", outputPath);

    try {
        // Ensure output and input directories exist
        if (!fsSync.existsSync(outputPath)) {
            fsSync.mkdirSync(outputPath, { recursive: true });
        }

        if (!fsSync.existsSync(inputPath)) {
            throw new Error(`Input path does not exist: ${inputPath}`);
        }

        if (Array.isArray(fileName)) {
            unconvertedImages = [...fileName];

            for (const name of fileName) {
                const filePath = path.join(inputPath, name);
                const webPath = path.join(outputPath, name.replace(/\.[^/.]+$/, ".webp"));

                try {
                    const result = await convertor(filePath, webPath, deleteOriginal);
                    if (result.success) {
                        convertedImages.push(webPath);
                        unconvertedImages = unconvertedImages.filter(item => item !== name);
                    }
                } catch (error) {
                    console.error(`Error converting ${name}:`, error.message);
                    continue;
                }
            }

            return {
                success: unconvertedImages.length === 0,
                failure: unconvertedImages.length > 0,
                message: unconvertedImages.length === 0 ? "All conversions successful" : "Some conversions failed",
                convertedImages,
                unconvertedImages
            };
        } 
        
        else if (typeof fileName === 'string') {
            const webPath = path.join(outputPath, fileName.replace(/\.[^/.]+$/, ".webp"));
            const result = await convertor(path.join(inputPath, fileName), webPath, deleteOriginal);

            return {
                success: result.success,
                failure: !result.success,
                message: result.message,
                convertedImages: result.success ? webPath : null,
                unconvertedImages: result.success ? [] : [fileName],
                error: result.error
            };
        }

        throw new Error("Invalid fileName type");

    } catch (error) {
        console.error("Error during conversion:", error.message);
        return {
            success: false,
            failure: true,
            message: "Conversion failed",
            convertedImages: [],
            unconvertedImages: Array.isArray(fileName) ? fileName : [fileName],
            error: error.message
        };
    }
}

async function convertor(inputPath, outputPath, deleteOriginal = true) {
    try {
        await sharp(inputPath)
            .webp({
                quality: 80,
                alphaQuality: 90,
                lossless: false,
                nearLossless: true,
                smartSubsample: true,
            })
            .toFile(outputPath);

        console.log("Converted:", path.basename(outputPath));

        // Optional: Delete original
        if (deleteOriginal) {
            console.log("Deleting original file:", path.basename(inputPath));
            try {
                await fs.unlink(inputPath);
                console.log("Deleted original:", path.basename(inputPath));
            } catch (unlinkError) {
                console.warn("Could not delete original file:", unlinkError.message);
            }
        } else {
            console.log("Keeping original file:", path.basename(inputPath));
        }

        return {
            success: true,
            message: "Conversion successful",
            outputPath,
            inputPath
        };
    } catch (err) {
        console.error("Conversion error for", inputPath, err.message);
        return {
            success: false,
            message: "Conversion failed",
            error: err.message
        };
    }
}

module.exports = { convertToWebP ,convertor};
