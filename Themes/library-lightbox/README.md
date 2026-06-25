# Steam-Library Lightbox Images

A Millennium theme that adds a lightbox image viewer to Steam Library news posts.

## What It Does

This theme enhances images inside Steam Library news posts by making them easier to view, zoom, pan, and copy.

When an image appears in a supported Steam Library post, the theme wraps it with an interactive overlay. Clicking the image opens it in a fullscreen lightbox viewer.

## Features

- Adds a fullscreen lightbox for Steam Library news post images
- Click an image to open it in an enlarged viewer
- Scroll to zoom in and out
- Drag the image to pan while zoomed
- Double-click the image to reset zoom and position
- Click outside the image or press `Esc` to close the lightbox
- Right-click an image to copy it to the clipboard
- Automatically detects newly loaded Steam Library post images

## How It Works

The theme injects a CSS file and a JavaScript file into the Steam client through Millennium.

The JavaScript waits for the Steam Library modal container to become available, then attaches a `MutationObserver`. This allows the theme to detect Steam Library news posts as they are added dynamically.

For each detected post, the theme scans for containing images. Each image is wrapped in a lightbox container with a hover overlay and icon.

When clicking on the image, the original image source is opened in a fullscreen overlay. The lightbox supports zooming, dragging, resetting, closing, and copying the image.

## Controls

| Action | Result |
| --- | --- |
| Click image | Open image in lightbox |
| Mouse wheel | Zoom in or out |
| Drag image | Pan image |
| Double-click image | Reset zoom and position |
| Right-click image | Copy image to clipboard |
| Click dark background | Close lightbox |
| Press `Esc` | Close lightbox |

## Notes

This theme depends on Steam Library DOM class names. If Steam changes those internal class names, the image detection logic may need to be updated.

## License


This project is licensed under the MIT License.

See [`LICENSE`](https://github.com/Kamiikaze/SteamBrew/blob/master/LICENSE) for details.