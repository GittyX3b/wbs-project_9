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
        required: [true, 'lat is required']
      },
      lon: {
        type: Number,
        required: [true, 'lon is required']
      }
    },
    stats: {
      buildingCount: {
        type: Number,
        min: [0, 'buildingCount cannot be negative']
      },
      parkCount: {
        type: Number,
        min: [0, 'parkCount cannot be negative']
      },
      avgElevation: {
        type: Number
      },
      avgTemperature: {
        type: Number
      },
      precipitation: {
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

export default model('Zone', zoneSchema);
