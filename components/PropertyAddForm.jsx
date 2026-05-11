'use client';

import { useState } from 'react';
import { generateAIPropertyContent } from '@/utils/requests';

const PropertyAddForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [rawNotes, setRawNotes] = useState('');

  const [fields, setFields] = useState({
    type: 'Apartment',
    name: '',
    description: '',
    location: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
    },
    beds: '',
    baths: '',
    square_feet: '',
    amenities: [],
    rates: {
      weekly: '',
      monthly: '',
      nightly: '',
    },
    seller_info: {
      name: '',
      email: '',
      phone: '',
    },
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // check if nested property
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
      setFields((fields) => ({
        // the parentheses are because implicit return
        ...fields,
        [outerKey]: {
          ...fields[outerKey], // this should be spread because [outerKey] will overwrite the entire object
          [innerKey]: value,
        },
      }));
    } else {
      setFields((fields) => ({ ...fields, [name]: value }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;

    setFields((fields) => {
      // check if value is already in array
      const amenities = checked
        ? [...fields.amenities, value]
        : fields.amenities.filter((item) => item !== value);

      return { ...fields, amenities };
    });
  };

  const handleImageChange = (e) => {
    const { files } = e.target;

    // Clone images array
    const updatedImages = [...fields.images];

    // Add new files to the arra
    for (const item of files) {
      updatedImages.push(item);
    }

    setFields((fields) => ({ ...fields, images: updatedImages }));
  };

  const handleGenerateAIContent = async () => {
    setAiError('');

    const location = [fields.location.city, fields.location.state]
      .filter(Boolean)
      .join(', ');

    if (!location) {
      setAiError('Add at least a city or state so the AI can tailor the copy.');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateAIPropertyContent({
        propertyType: fields.type,
        location,
        beds: fields.beds,
        baths: fields.baths,
        amenities: fields.amenities,
        rawNotes,
      });

      setFields((prev) => ({
        ...prev,
        name: result.data.title,
        description: result.data.shortDescription,
      }));
    } catch (error) {
      setAiError(error.message || 'Failed to generate AI content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {' '}
      <form
        action='/api/properties'
        method='POST'
        encType='multipart/form-data'
      >
        <h2 className='text-3xl text-center font-semibold mb-6'>
          Create a listing
        </h2>

        <div className='mb-4'>
          <label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
            Listing Type
          </label>
          <select
            id='type'
            name='type'
            className='border rounded w-full py-2 px-3'
            required
            value={fields.type}
            onChange={handleChange}
          >
            <option value='Apartment'>Apartment</option>
            <option value='Condo'>Condo</option>
            <option value='House'>House</option>
            <option value='Cabin Or Cottage'>Cabin or Cottage</option>
            <option value='Room'>Room</option>
            <option value='Studio'>Studio</option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Public Title
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Short headline renters will see first'
            required
            value={fields.name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 font-bold mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            className='border rounded w-full py-2 px-3'
            rows='4'
            placeholder='Highlights, neighborhood, and what makes this place a great fit'
            value={fields.description}
            onChange={handleChange}
          ></textarea>
          <div className='mt-3 pt-3 border-t border-gray-200'>
            <label
              htmlFor='rawNotes'
              className='block text-gray-500 text-xs mb-1'
            >
              Notes for AI <span className='font-normal'>(optional)</span>
            </label>
            <p className='text-xs text-gray-500 mb-2'>
              These notes help draft title and description. They are not shown
              publicly unless you keep them in the fields above.
            </p>
            <textarea
              id='rawNotes'
              className='border rounded w-full py-2 px-3 mb-2 text-sm text-gray-600'
              rows='2'
              placeholder='e.g. Top floor, in-unit laundry, 10 minutes to transit'
              value={rawNotes}
              onChange={(e) => {
                setRawNotes(e.target.value);
                if (aiError) setAiError('');
              }}
            />
            {aiError && <p className='text-red-500 text-xs mb-2'>{aiError}</p>}
            <button
              type='button'
              onClick={handleGenerateAIContent}
              disabled={isGenerating}
              aria-busy={isGenerating}
              className='text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium focus:outline-none'
            >
              {isGenerating ? 'Generating...' : 'Generate listing with AI'}
            </button>
          </div>
        </div>

        <div className='mb-4 bg-blue-50 p-4'>
          <label className='block text-gray-700 font-bold mb-2'>Location</label>
          <p className='text-sm text-gray-600 mb-3'>
            This appears in search and on the listing map. City and state are
            required.
          </p>
          <input
            type='text'
            id='street'
            name='location.street'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Street'
            value={fields.location.street}
            onChange={handleChange}
          />
          <input
            type='text'
            id='city'
            name='location.city'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='City'
            required
            value={fields.location.city}
            onChange={handleChange}
          />
          <input
            type='text'
            id='state'
            name='location.state'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='State'
            required
            value={fields.location.state}
            onChange={handleChange}
          />
          <input
            type='text'
            id='zipcode'
            name='location.zipcode'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Zipcode'
            value={fields.location.zipcode}
            onChange={handleChange}
          />
        </div>

        <div className='mb-4 flex flex-wrap'>
          <div className='w-full sm:w-1/3 pr-2'>
            <label
              htmlFor='beds'
              className='block text-gray-700 font-bold mb-2'
            >
              Beds
            </label>
            <input
              type='number'
              id='beds'
              name='beds'
              className='border rounded w-full py-2 px-3'
              required
              value={fields.beds}
              onChange={handleChange}
            />
          </div>
          <div className='w-full sm:w-1/3 px-2'>
            <label
              htmlFor='baths'
              className='block text-gray-700 font-bold mb-2'
            >
              Baths
            </label>
            <input
              type='number'
              id='baths'
              name='baths'
              className='border rounded w-full py-2 px-3'
              required
              value={fields.baths}
              onChange={handleChange}
            />
          </div>
          <div className='w-full sm:w-1/3 pl-2'>
            <label
              htmlFor='square_feet'
              className='block text-gray-700 font-bold mb-2'
            >
              Square Feet
            </label>
            <input
              type='number'
              id='square_feet'
              name='square_feet'
              className='border rounded w-full py-2 px-3'
              required
              value={fields.square_feet}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Amenities
          </label>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            <div>
              <input
                type='checkbox'
                id='amenity_wifi'
                name='amenities'
                value='Wifi'
                className='mr-2'
                checked={fields.amenities.includes('Wifi')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_wifi'>Wifi</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_kitchen'
                name='amenities'
                value='Full Kitchen'
                className='mr-2'
                checked={fields.amenities.includes('Full Kitchen')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_kitchen'>Full kitchen</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_washer_dryer'
                name='amenities'
                value='Washer & Dryer'
                className='mr-2'
                checked={fields.amenities.includes('Washer & Dryer')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_washer_dryer'>Washer & Dryer</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_free_parking'
                name='amenities'
                value='Free Parking'
                className='mr-2'
                checked={fields.amenities.includes('Free Parking')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_free_parking'>Free Parking</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_pool'
                name='amenities'
                value='Swimming Pool'
                className='mr-2'
                checked={fields.amenities.includes('Swimming Pool')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_pool'>Swimming Pool</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_hot_tub'
                name='amenities'
                value='Hot Tub'
                className='mr-2'
                checked={fields.amenities.includes('Hot Tub')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_hot_tub'>Hot Tub</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_24_7_security'
                name='amenities'
                value='24/7 Security'
                className='mr-2'
                checked={fields.amenities.includes('24/7 Security')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_24_7_security'>24/7 Security</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_wheelchair_accessible'
                name='amenities'
                value='Wheelchair Accessible'
                className='mr-2'
                checked={fields.amenities.includes('Wheelchair Accessible')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_wheelchair_accessible'>
                Wheelchair Accessible
              </label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_elevator_access'
                name='amenities'
                value='Elevator Access'
                className='mr-2'
                checked={fields.amenities.includes('Elevator Access')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_elevator_access'>Elevator Access</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_dishwasher'
                name='amenities'
                value='Dishwasher'
                className='mr-2'
                checked={fields.amenities.includes('Dishwasher')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_dishwasher'>Dishwasher</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_gym_fitness_center'
                name='amenities'
                value='Gym/Fitness Center'
                className='mr-2'
                checked={fields.amenities.includes('Gym/Fitness Center')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_gym_fitness_center'>
                Gym/Fitness Center
              </label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_air_conditioning'
                name='amenities'
                value='Air Conditioning'
                className='mr-2'
                checked={fields.amenities.includes('Air Conditioning')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_air_conditioning'>Air Conditioning</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_balcony_patio'
                name='amenities'
                value='Balcony/Patio'
                className='mr-2'
                checked={fields.amenities.includes('Balcony/Patio')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_balcony_patio'>Balcony/Patio</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_smart_tv'
                name='amenities'
                value='Smart TV'
                className='mr-2'
                checked={fields.amenities.includes('Smart TV')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_smart_tv'>Smart TV</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_coffee_maker'
                name='amenities'
                value='Coffee Maker'
                className='mr-2'
                checked={fields.amenities.includes('Coffee Maker')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_coffee_maker'>Coffee Maker</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_internet'
                name='amenities'
                value='High Speed Internet'
                className='mr-2'
                checked={fields.amenities.includes('High Speed Internet')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_internet'>High Speed Internet</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_grill'
                name='amenities'
                value='Outdoor Grill/BBQ'
                className='mr-2'
                checked={fields.amenities.includes('Outdoor Grill/BBQ')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_grill'>Outdoor Grill/BBQ</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_fireplace'
                name='amenities'
                value='Fireplace'
                className='mr-2'
                checked={fields.amenities.includes('Fireplace')}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor='amenity_fireplace'>Fireplace</label>
            </div>
          </div>
        </div>

        <div className='mb-4 bg-blue-50 p-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Rates <span className='font-normal text-gray-600'>(optional)</span>
          </label>
          <p className='text-sm text-gray-600 mb-3'>
            Add only the pricing tiers you offer.
          </p>
          <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
            <div className='flex items-center'>
              <label htmlFor='weekly_rate' className='mr-2'>
                Weekly
              </label>
              <input
                type='number'
                id='weekly_rate'
                name='rates.weekly'
                className='border rounded w-full py-2 px-3'
                value={fields.rates.weekly}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='monthly_rate' className='mr-2'>
                Monthly
              </label>
              <input
                type='number'
                id='monthly_rate'
                name='rates.monthly'
                className='border rounded w-full py-2 px-3'
                value={fields.rates.monthly}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center'>
              <label htmlFor='nightly_rate' className='mr-2'>
                Nightly
              </label>
              <input
                type='number'
                id='nightly_rate'
                name='rates.nightly'
                className='border rounded w-full py-2 px-3'
                value={fields.rates.nightly}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='seller_name'
            className='block text-gray-700 font-bold mb-2'
          >
            Contact Name
          </label>
          <input
            type='text'
            id='seller_name'
            name='seller_info.name'
            className='border rounded w-full py-2 px-3'
            placeholder='How you want to appear to renters'
            value={fields.seller_info.name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='seller_email'
            className='block text-gray-700 font-bold mb-2'
          >
            Contact Email
          </label>
          <input
            type='email'
            id='seller_email'
            name='seller_info.email'
            className='border rounded w-full py-2 px-3'
            placeholder='you@example.com'
            required
            value={fields.seller_info.email}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='seller_phone'
            className='block text-gray-700 font-bold mb-2'
          >
            Contact Phone
          </label>
          <input
            type='tel'
            id='seller_phone'
            name='seller_info.phone'
            className='border rounded w-full py-2 px-3'
            placeholder='Optional'
            value={fields.seller_info.phone}
            onChange={handleChange}
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='images'
            className='block text-gray-700 font-bold mb-2'
          >
            Photos <span className='font-normal text-gray-600'>(up to 4)</span>
          </label>
          <input
            type='file'
            id='images'
            name='images'
            className='border rounded w-full py-2 px-3'
            accept='image/*'
            multiple
            onChange={handleImageChange}
            required
          />
        </div>

        <div>
          <button
            className='bg-brand text-white font-bold py-2 px-4 rounded-full w-full hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2'
            type='submit'
          >
            Publish Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyAddForm;
