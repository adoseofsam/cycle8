import './ExploreContainer.css';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <div className="container">
      <strong>Oh no, No Events?</strong>
      <p>Create a new one today!</p>
    </div>
  );
};

export default ExploreContainer;