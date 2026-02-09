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
      buildingDensity: {
        type: Number,
        min: [0, 'buildingCount cannot be negative']
      },
      roadToBuildingRatio: {
        type: Number,
        min: [0, 'roadToBuildingRatio cannot be negative']
      },
      greenToBuildingRatio: {
        type: Number,
        min: [0, 'greenToBuildingRatio cannot be negative']
      },
      waterAreaKm2: {
        type: Number,
        min: [0, 'waterAreaKm2 cannot be negative']
      },
      riverLengthKm: {
        type: Number,
        min: [0, 'riverLengthKm cannot be negative']
      },
      restaurantCount: {
        type: Number,
        min: [0, 'restaurantCount cannot be negative']
      },
      fastFoodCount: {
        type: Number,
        min: [0, 'fastFoodCount cannot be negative']
      },
      cafeCount: {
        type: Number,
        min: [0, 'cafeCount cannot be negative']
      },
      supermarketCount: {
        type: Number,
        min: [0, 'supermarketCount cannot be negative']
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
