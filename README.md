# ImageUploadFrontEnd (BME 590s Image Processor Final Project)
This React project creates a frontend client for users to upload and process images. Users can select the image file (color or grayscale) they want to upload from their local machine (`.jpg`, `.jpeg`, `.png`, `.tiff`) and then perform the following processes on the image:
* Histogram Equalization
* Contrast Stretching
* Log Compression
* Reverse Video

This frontend client satisfies the requirements laid out in the BME590s [Final Project markdown](https://github.com/mlp6/Medical-Software-Design/blob/master/FinalProjects/ImageProcessorS18/ImageProcessorS18.md).

## Running the app
To run this React app, simply run the following command from the root level of this repository:  
1) `npm install`  
2) `npm run start`

## Supported filetypes
`.jpg`, `.jpeg`, `.png`, `.tiff` are the supported file types. 

Both color and grayscale images are supported. 

At this time, mulitple image upload is **NOT** supported. If the user selects multiple images to upload, they will see a warning and only the first image will be uploaded and displayed in the client. 

## Uploading images
To upload an image, simply click the dropzone or drag an image onto the dropzone: 

SCREENSHOT

You can also upload a new image at any time by clicking on the `Upload New Image` button: 

SCREENSHOT
