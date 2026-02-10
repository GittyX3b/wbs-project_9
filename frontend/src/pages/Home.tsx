import { useSession } from '@/data';
import { Hero, LocationForm, Narratives, Response } from '@components';

export const Home = () => {
  const { locationform } = useSession();

  return (
    <>
      <title>MapTold</title>
      <main>
        <Hero />
        <LocationForm />
        {!locationform.success ? <Narratives /> : <Response />}
      </main>
    </>
  );
};
