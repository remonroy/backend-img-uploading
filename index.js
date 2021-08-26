const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


const UPLOAD_FILES = './uploads/'


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,UPLOAD_FILES)
    },
    filename:(req,file,cb)=>{
        const fileExt = path.extname(file.originalname)
        const fileName =file.originalname
                            .replace(fileExt,'')
                            .toLowerCase()
                            .split(" ")
                            .join("-")+ "-" + Date.now()
        cb(null,fileName + fileExt)
    }
    
})


const upload = multer({
    storage:storage,
    limits:{
        fileSize:1000000 //1MB
    },
    fileFilter:(req,file,cb)=>{
        if (file.fieldname === 'avatar') {
            if (
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/png'
            ) {
                cb(null,true)
            }else{
                cb(new Error('Uploaded file jpeg,jpg or png file supported..?'))
            }
        }else if(file.fieldname === 'doc'){
            if (
                file.mimetype === 'application/pdf'
            ) {
                cb(null,true)
            }else{
                cb(new Error('Uploaded file pdf supported..?'))
            }
        }
    }
})

app.post("/",upload.fields([
    {name:'avatar',maxCount:1},
    {name:'doc',maxCount:1},
]),(req,res)=>{
    const avatarName=req.files.avatar[0].filename
    const docName=req.files.doc[0].filename
    console.log(avatarName, docName);



    res.json({message:'Hello bangladesh'})
})

app.get("/",(req,res)=>{
    res.json({message:'Hello everyone'})
})

app.use((err,req,res,next)=>{
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('Multer error defined...?')
        }else{
            res.status(500).send(err.message)
        }
    }else{
        res.status(200).send('success')
    }
})
const PORT =process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`This is server port ${PORT}`);
})