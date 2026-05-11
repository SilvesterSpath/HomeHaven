import InfoBox from './InfoBox';

const InfoBoxes = () => {
  return (
    <section>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <InfoBox
            heading='For renters'
            backgroundColor='bg-gray-100'
            textColor='text-gray-800'
            buttonInfo={{
              text: 'Browse rentals',
              link: '/properties',
              backgroundColor: 'bg-brand-dark',
            }}
          >
            Search verified listings, save the ones you love, and message hosts
            when you are ready to move.
          </InfoBox>
          <InfoBox
            heading='For property owners'
            backgroundColor='bg-brand-surface'
            textColor='text-gray-800'
            buttonTextColor='text-brand-dark'
            buttonInfo={{
              text: 'List your place',
              link: '/properties/add',
              backgroundColor: 'bg-brand-accent',
            }}
          >
            Publish your space, manage inquiries, and reach renters looking for
            short stays or long-term homes.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};

export default InfoBoxes;
