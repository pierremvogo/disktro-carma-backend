import { Router } from "express";
import fileUpload from "express-fileupload";
import path from "path";


const uploadRoute = Router();
const audioFolder = path.join(`${__dirname}/../public/audio_song`)
const videoFolder = path.join(`${__dirname}/../public/video_song`)


uploadRoute.use(fileUpload())

uploadRoute.post("/audio", (req, res) => {
  console.log(req.files?.files)
  const  file  : any = req.files?.files
  if (
    file.name.split(".")[1] != "mp3" &&
    file.name.split(".")[1] != "wav" &&
    file.name.split(".")[1] != "flac"
  ) {
    res.status(400).json({
      message: "Format de fichier invalide",
    });
    return;
  } else {
        file.mv(path.join(audioFolder, file.name))
        res.send({
          message: "Audio song Enregistré avec succes",
          url: `/download/audio/${file.name}`,
        });
  }
});

uploadRoute.post("/video", (req, res) => {
  console.log(req.files?.files)
  const  file : any = req.files?.files
  if (
    file.name.split(".")[1] != "mp4" &&
    file.name.split(".")[1] != "mov"
  ) {
    res.status(400).json({
      message: "Format de fichier invalide",
    });
    return;
  } else {
        file.mv(path.join(videoFolder, file.name))
        res.send({
          message: "Vidéo song nregistrée avec succes",
          url: `/download/video/${file.name}`,
        });
  }
});

export default uploadRoute;
