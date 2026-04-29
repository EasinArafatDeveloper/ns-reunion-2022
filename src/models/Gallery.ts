import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // Base64 image
  category: { type: String, default: 'REUNION 2022' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
