import axios from "axios";

const uploadCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "JobQuest");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkhb82oi0/image/upload",
      data
    );
    const { url } = res.data;
    return url;
  } catch (error) {
    console.log(error);
  }
};

export default uploadCloudinary;
