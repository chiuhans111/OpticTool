gource -1280x720 -o ./gource/gource.ppm
ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i ./gource/gource.ppm -vcodec libx264 -preset medium -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 ./gource/gource.mp4
