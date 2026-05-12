'use client';

import { useState } from 'react';
import { FaMagic } from 'react-icons/fa';
import { generateAIPropertyContent } from '@/utils/requests';

const INPUT_CLASS =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

const LABEL_CLASS = 'block text-sm font-medium text-gray-800 mb-1';

const AMENITIES = [
  { id: 'amenity_wifi', value: 'Wifi', label: 'Wifi' },
  { id: 'amenity_kitchen', value: 'Full Kitchen', label: 'Full kitchen' },
  { id: 'amenity_washer_dryer', value: 'Washer & Dryer', label: 'Washer & Dryer' },
  { id: 'amenity_free_parking', value: 'Free Parking', label: 'Free Parking' },
  { id: 'amenity_pool', value: 'Swimming Pool', label: 'Swimming Pool' },
  { id: 'amenity_hot_tub', value: 'Hot Tub', label: 'Hot Tub' },
  { id: 'amenity_24_7_security', value: '24/7 Security', label: '24/7 Security' },
  {
    id: 'amenity_wheelchair_accessible',
    value: 'Wheelchair Accessible',
    label: 'Wheelchair Accessible',
  },
  { id: 'amenity_elevator_access', value: 'Elevator Access', label: 'Elevator Access' },
  { id: 'amenity_dishwasher', value: 'Dishwasher', label: 'Dishwasher' },
  {
    id: 'amenity_gym_fitness_center',
    value: 'Gym/Fitness Center',
    label: 'Gym/Fitness Center',
  },
  { id: 'amenity_air_conditioning', value: 'Air Conditioning', label: 'Air Conditioning' },
  { id: 'amenity_balcony_patio', value: 'Balcony/Patio', label: 'Balcony/Patio' },
  { id: 'amenity_smart_tv', value: 'Smart TV', label: 'Smart TV' },
  { id: 'amenity_coffee_maker', value: 'Coffee Maker', label: 'Coffee Maker' },
  { id: 'amenity_internet', value: 'High Speed Internet', label: 'High Speed Internet' },
  { id: 'amenity_grill', value: 'Outdoor Grill/BBQ', label: 'Outdoor Grill/BBQ' },
  { id: 'amenity_fireplace', value: 'Fireplace', label: 'Fireplace' },
];

const Section = ({ title, description, children }) => (
  <section className='border-t border-gray-200 pt-6 mt-6 first:border-t-0 first:pt-0 first:mt-0'>
    <header className='mb-4'>
      <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
      {description && (
        <p className='mt-1 text-sm text-gray-500'>{description}</p>
      )}
    </header>
    <div className='space-y-4'>{children}</div>
  </section>
);

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

    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
      setFields((fields) => ({
        ...fields,
        [outerKey]: {
          ...fields[outerKey],
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
      const amenities = checked
        ? [...fields.amenities, value]
        : fields.amenities.filter((item) => item !== value);

      return { ...fields, amenities };
    });
  };

  const handleImageChange = (e) => {
    const { files } = e.target;

    const updatedImages = [...fields.images];

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
    <form
      action='/api/properties'
      method='POST'
      encType='multipart/form-data'
    >
      <header className='mb-8 border-b border-gray-200 pb-6'>
        <h2 className='text-2xl font-semibold text-gray-900'>Create a listing</h2>
        <p className='mt-1 text-sm text-gray-500'>
          Publish a new property. Fill in the details below — you can use AI to
          draft a title and description from your notes.
        </p>
      </header>

      <Section
        title='Basic information'
        description='The headline and short description renters will see first.'
      >
        <div>
          <label htmlFor='type' className={LABEL_CLASS}>
            Listing Type
          </label>
          <select
            id='type'
            name='type'
            className={INPUT_CLASS}
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

        <div>
          <label htmlFor='name' className={LABEL_CLASS}>
            Public Title
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className={INPUT_CLASS}
            placeholder='Short headline renters will see first'
            required
            value={fields.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor='description' className={LABEL_CLASS}>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            className={INPUT_CLASS}
            rows='4'
            placeholder='Highlights, neighborhood, and what makes this place a great fit'
            value={fields.description}
            onChange={handleChange}
          ></textarea>
        </div>
      </Section>

      <Section
        title='AI listing generation'
        description='Generate a title and description from a few notes about the property. You can edit the result before publishing.'
      >
        <div className='rounded-lg border border-indigo-100 bg-indigo-50/60 p-4'>
          <div className='flex items-start gap-3'>
            <FaMagic className='mt-1 shrink-0 text-indigo-600' aria-hidden />
            <div className='flex-1'>
              <label
                htmlFor='rawNotes'
                className='block text-sm font-medium text-gray-800'
              >
                Notes for AI{' '}
                <span className='font-normal text-gray-500'>(optional)</span>
              </label>
              <p className='mt-1 text-xs text-gray-500'>
                These notes help draft the title and description. They are not
                shown publicly unless you keep them in the fields above.
              </p>
              <textarea
                id='rawNotes'
                className='mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400'
                rows='2'
                placeholder='e.g. Top floor, in-unit laundry, 10 minutes to transit'
                value={rawNotes}
                onChange={(e) => {
                  setRawNotes(e.target.value);
                  if (aiError) setAiError('');
                }}
              />
              {aiError && (
                <p className='mt-2 text-xs text-red-600' role='alert'>
                  {aiError}
                </p>
              )}
              <div className='mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <p className='text-xs text-gray-500'>
                  Uses Type, Location, Beds/Baths, and Amenities you have entered.
                </p>
                <button
                  type='button'
                  onClick={handleGenerateAIContent}
                  disabled={isGenerating}
                  aria-busy={isGenerating}
                  className='inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
                >
                  <FaMagic aria-hidden />
                  {isGenerating ? 'Generating...' : 'Generate listing with AI'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title='Location'
        description='This appears in search and on the listing map. City and state are required.'
      >
        <div>
          <label htmlFor='street' className={LABEL_CLASS}>
            Street
          </label>
          <input
            type='text'
            id='street'
            name='location.street'
            className={INPUT_CLASS}
            placeholder='Street'
            value={fields.location.street}
            onChange={handleChange}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='city' className={LABEL_CLASS}>
              City
            </label>
            <input
              type='text'
              id='city'
              name='location.city'
              className={INPUT_CLASS}
              placeholder='City'
              required
              value={fields.location.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='state' className={LABEL_CLASS}>
              State
            </label>
            <input
              type='text'
              id='state'
              name='location.state'
              className={INPUT_CLASS}
              placeholder='State'
              required
              value={fields.location.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='sm:max-w-xs'>
          <label htmlFor='zipcode' className={LABEL_CLASS}>
            Zipcode
          </label>
          <input
            type='text'
            id='zipcode'
            name='location.zipcode'
            className={INPUT_CLASS}
            placeholder='Zipcode'
            value={fields.location.zipcode}
            onChange={handleChange}
          />
        </div>
      </Section>

      <Section
        title='Property details'
        description='Core specs renters use to filter listings.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div>
            <label htmlFor='beds' className={LABEL_CLASS}>
              Beds
            </label>
            <input
              type='number'
              id='beds'
              name='beds'
              className={INPUT_CLASS}
              required
              value={fields.beds}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='baths' className={LABEL_CLASS}>
              Baths
            </label>
            <input
              type='number'
              id='baths'
              name='baths'
              className={INPUT_CLASS}
              required
              value={fields.baths}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='square_feet' className={LABEL_CLASS}>
              Square Feet
            </label>
            <input
              type='number'
              id='square_feet'
              name='square_feet'
              className={INPUT_CLASS}
              required
              value={fields.square_feet}
              onChange={handleChange}
            />
          </div>
        </div>
      </Section>

      <Section
        title='Amenities'
        description='Select everything this property offers.'
      >
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
          {AMENITIES.map((a) => {
            const checked = fields.amenities.includes(a.value);
            return (
              <label
                key={a.id}
                htmlFor={a.id}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  checked
                    ? 'border-brand bg-brand/5 text-brand-dark'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type='checkbox'
                  id={a.id}
                  name='amenities'
                  value={a.value}
                  className='h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand'
                  checked={checked}
                  onChange={handleAmenitiesChange}
                />
                <span>{a.label}</span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section
        title='Pricing'
        description='Add only the pricing tiers you offer.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div>
            <label htmlFor='weekly_rate' className={LABEL_CLASS}>
              Weekly
            </label>
            <input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className={INPUT_CLASS}
              value={fields.rates.weekly}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='monthly_rate' className={LABEL_CLASS}>
              Monthly
            </label>
            <input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className={INPUT_CLASS}
              value={fields.rates.monthly}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='nightly_rate' className={LABEL_CLASS}>
              Nightly
            </label>
            <input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className={INPUT_CLASS}
              value={fields.rates.nightly}
              onChange={handleChange}
            />
          </div>
        </div>
      </Section>

      <Section
        title='Contact information'
        description='How renters will reach you about this listing.'
      >
        <div>
          <label htmlFor='seller_name' className={LABEL_CLASS}>
            Contact Name
          </label>
          <input
            type='text'
            id='seller_name'
            name='seller_info.name'
            className={INPUT_CLASS}
            placeholder='How you want to appear to renters'
            value={fields.seller_info.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='seller_email' className={LABEL_CLASS}>
            Contact Email
          </label>
          <input
            type='email'
            id='seller_email'
            name='seller_info.email'
            className={INPUT_CLASS}
            placeholder='you@example.com'
            required
            value={fields.seller_info.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='seller_phone' className={LABEL_CLASS}>
            Contact Phone
          </label>
          <input
            type='tel'
            id='seller_phone'
            name='seller_info.phone'
            className={INPUT_CLASS}
            placeholder='Optional'
            value={fields.seller_info.phone}
            onChange={handleChange}
          />
        </div>
      </Section>

      <Section
        title='Photos'
        description='Add up to 4 images. The first photo is used as the cover.'
      >
        <div>
          <label htmlFor='images' className={LABEL_CLASS}>
            Photos{' '}
            <span className='font-normal text-gray-500'>(up to 4)</span>
          </label>
          <input
            type='file'
            id='images'
            name='images'
            className='block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:brightness-110'
            accept='image/*'
            multiple
            onChange={handleImageChange}
            required
          />
        </div>
      </Section>

      <div className='mt-8 border-t border-gray-200 pt-6'>
        <button
          className='w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2'
          type='submit'
        >
          Publish Listing
        </button>
      </div>
    </form>
  );
};

export default PropertyAddForm;
