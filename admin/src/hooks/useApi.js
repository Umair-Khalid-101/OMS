import axios from "axios";

const useApi = () => {

    const uploadImage = async (name, file) => {
        const formData = new FormData();

        formData.append(name, file);

        try {

            const response = await axios.post('/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return {
                status: 200,
                message: response.data.message,
                image: response.data.imageUrl
            }

        } catch (error) {
            return {
                status: 400,
                message: error?.response?.data?.message || error.message
            }
        }

    }

    const uploadImages = async (name, files) => {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append(name, files[i]);
        }

        try {
            const response = await axios.post('/upload-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // console.log(response);
            return {
                status: 200,
                message: response.data.message,
                images: response.data.imageUrls
            }

        } catch (error) {
            return {
                status: 400,
                message: error?.response?.data?.message || error.message
            }
        }
    }

    const updateImages = async (files) => {

        let images = [];
        for (let i = 0; i < files.length; i++) {

            if (typeof files[i] == 'string') {
                images.push(files[i]);
            } else {
                const response = await uploadImage('image', files[i]);
                if (response.status === 200) {
                    images.push(response.image);
                }
            }


        }

        return {
            status: 200,
            images
        };
    }


    return { uploadImage, uploadImages, updateImages }
}

export default useApi;