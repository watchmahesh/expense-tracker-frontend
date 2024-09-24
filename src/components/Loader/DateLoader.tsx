import ContentLoader from 'react-content-loader';

const DataListLoader = () => (
  <div className="flex flex-col gap-10">
    <ContentLoader
      speed={1}
      width="100%"
      height={50}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
      <rect x="0" y="25" rx="5" ry="5" width="100%" height="20" />
    </ContentLoader>
    {/* Add more loaders if needed */}
  </div>
);

export default DataListLoader;
