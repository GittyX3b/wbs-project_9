import { model, Schema } from 'mongoose';

const analysisSchema = new Schema(
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
    metrics: {
      populationDensity: {
        type: Number
      },
      greenSpace: {
        type: Number
      },
      elevation: {
        type: Number
      },
      temperature: {
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

export default model('Analysis', analysisSchema);
