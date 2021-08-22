const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const path =require('path')


const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

const UPLOADS_FILE = './uploads/'

const storage = multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,UPLOADS_FILE)
    },
    filename:(req,file,cd)=>{
        const fileExt = path.extname(file.originalname)
        const fileName = file.originalname
                        .replace(fileExt,"")
                        .toLowerCase()
                        .split(" ")
                        .join("-") + "-" + Date.now()
        cd(null,fileName + fileExt)
    }
})



const upload = multer({
    storage:storage,
    limits:{
        fileSize:1000000, //1MB file
    },
    fileFilter:(req,file,cd)=>{
        if (file.fieldname === 'avatar') {
            if (
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/png'
            ) {
                cd(null,true)
            }else{
                cd(new Error('Only uploaded jpeg,png or jpg...!'))
            }
        }else if(file.fieldname === 'doc'){
            if (
                file.mimetype === 'application/pdf'
            ) {
                cd(null,true)
            }else{
                cd(new Error('Only used pdf file..?'))
            }
        }
        
    }
})


app.post("/",upload.fields([
    {name:'avatar',maxCount:1},
    {name:'doc',maxCount:1},
]),(req,res)=>{
    const picName=req.files.avatar[0].filename
    const docName=req.files.doc[0].filename
    console.log(picName,docName);
    res.json({message:'Hello bangladesh'})
})
app.use((err,req,res,next)=>{
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('There was a multer error..?')
        }else{
            res.status(500).send(err.message)
        }
    }else{
        res.status(200).send('File upload success..!')
    }
})

app.get("/",(req,res)=>{
    res.json({message:'Hello everyone'})
})

const PORT =process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`This is server port ${PORT}`);
})