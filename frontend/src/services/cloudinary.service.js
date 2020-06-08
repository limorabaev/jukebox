export default {
    uploadImg
}

function uploadImg(file) {
    const CLOUD_NAME = 'dpjz7lloq'
    const PRESET_NAME = 'pjoqxv8c'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', PRESET_NAME);
    return fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}