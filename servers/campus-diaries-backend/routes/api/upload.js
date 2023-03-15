const router = require('express').Router()
const uuid = require('uuid/v1')
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-south-1' })
const eduProofDocsAccessKey = process.env.EDU_PROOF_DOCS_ACCESS_KEY
const eduProofDocsSecretKey = process.env.EDU_PROOF_DOCS_SECRET_KEY

const s3 = new AWS.S3({
    accessKeyId: eduProofDocsAccessKey,
    secretAccessKey: eduProofDocsSecretKey
})

router.get('/college-documents', (req, res, next) => {
    const key = `${uuid()}.jpeg`
    s3.getSignedUrl('putObject', {
        Bucket: 'education-proofs',
        Key: key,
        ContentType: 'image/jpeg'
    }, (err, url) => {
        if (err) {
            // TODO: Log and send error mail
            next(err)
        }
        res.status(201).json({
            filename: key,
            url: url
        })
    })
})

module.exports = router
