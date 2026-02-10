import { useSession } from '@data';

export const AiText = () => {
  const { responsedata } = useSession();

  return (
    <div id='AI-Text' className='response-component'>
      <h3>Umgebung</h3>
      <div className=''>{responsedata.aiText}</div>
    </div>
  );
};
