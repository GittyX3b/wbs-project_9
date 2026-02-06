import { model, Schema } from 'mongoose';

const zoneSchema = new Schema(
  {
    bbox: {
      type: [Number],
      required: [true, 'bbox is required'],
      validate: {
        validator: (arr: number[]) => arr.length === 4,
        message: 'bbox must have exactly 4 numbers'
      }
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'lat is required'],
        min: [-90, 'lat must be >= -90'],
        max: [90, 'lat must be <= 90']
      },
      lon: {
        type: Number,
        required: [true, 'lon is required'],
        min: [-180, 'lon must be >= -180'],
        max: [180, 'lon must be <= 180']
      }
    },
    stats: {
      buildingCount: {
        type: Number,
        min: [0, 'buildingCount cannot be negative']
      },
      greenCount: {
        type: Number,
        min: [0, 'greenAreaCount cannot be negative']
      },
      roadCount: {
        type: Number,
        min: [0, 'roadCount cannot be negative']
      },
      waterCount: {
        type: Number,
        min: [0, 'waterCount cannot be negative']
      },
      elevation: {
        type: Number
      }
    },
    aiText: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

zoneSchema.index({ 'coordinates.lat': 1, 'coordinates.lon': 1 });

export default model('Zone', zoneSchema);
