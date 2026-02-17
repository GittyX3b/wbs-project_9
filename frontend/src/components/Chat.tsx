import React, { useState } from 'react';
import { LuLoader, LuSendToBack } from 'react-icons/lu';

import { useSession } from '@data';

type messagesType = {
  id: string;
  prompt: string;
  response: string;
};

export const Chat = () => {
  const [messages, setMessage] = useState<messagesType[]>([]);
  const [pending, setPending] = useState(false);
  const { responsedata, locationform } = useSession();
  const { zoneId } = responsedata;

  //responsedata.id
  const submitAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const promptValue = form.prompt.value;

    if (!promptValue) return;

    setPending(true);

    // Prompt SOFORT anzeigen
    const newMessage = {
      id: crypto.randomUUID(),
      prompt: promptValue,
      response: '',
    };

    setMessage((prev) => [...prev, newMessage]);

    // input leeren
    form.reset();

    //context

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/aiTools/${zoneId}`, {
        //id soll geändert werden, damit es dynamisch ist
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptValue }),
      });

      console.log(response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`API Request failed! status: ${response.status}`);
      }
      const data = (await response.json()) as { response: string };
      setMessage((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, response: data.response } : msg)),
      );
      console.log('AiTools API response:', data);
    } catch (err) {
      setMessage((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? {
                ...msg,
                response: '⚠️ Etwas ist schiefgelaufen. Bitte versuche es in Kürze erneut.',
              }
            : msg,
        ),
      );
      throw new Error(`API Fetch error:: ${err}`);
    } finally {
      setPending(false);
    }
  };

  return (
    <aside id='chat' className='flex flex-col-reverse'>
      {/* Input area ========================================== */}
      <div
        className={`grid gap-5 px-5 pt-15 pb-10 lg:grid-cols-[1fr_450px] lg:px-20 xl:grid-cols-[1fr_600px] ${pending ? 'bg-mt-color-13 text-green-600' : locationform.mask === 'address' ? 'bg-mt-color-4' : 'bg-mt-color-20'}`}
      >
        <h3>{`${pending ? 'Die Anfrage läuft...' : `Stell noch eine Frage:`}`}</h3>
        <form className='m-auto w-full' onSubmit={submitAction}>
          <textarea
            name='prompt'
            placeholder='Gib deine Frage ein...'
            className='input input-primary h-40 w-full p-3'
            disabled={pending}
          />
          <button
            className={`btn m-auto mt-4 w-full text-white ${pending ? 'bg-mt-color-11 cursor-not-allowed' : 'bg-mt-color-31'}`}
            disabled={pending}
          >
            {pending ? (
              <>
                <LuLoader className='animate-spin' />
                bitte Geduld...
              </>
            ) : (
              <>
                <LuSendToBack />
                Senden
              </>
            )}
          </button>
        </form>
      </div>

      {/* History and response area =========================== */}
      <div id='Chat-History'>
        {messages.map((message) => (
          <div
            key={message.id}
            className='bg-mt-color-30 m-4 grid gap-10 rounded-2xl px-5 pt-15 pb-10 lg:grid-cols-[1fr_450px] lg:px-20 xl:grid-cols-[1fr_600px]'
          >
            <div className='chat chat-start'>
              <div
                className={`chat-bubble chat-bubble-secondary italic ${message.prompt ? 'visible' : 'invisible'}`}
              >
                {message.prompt}
              </div>
            </div>
            <div className='chat chat-end'>
              <div className={`chat-bubble ${message.response ? 'visible' : 'invisible'}`}>
                {message.response}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
