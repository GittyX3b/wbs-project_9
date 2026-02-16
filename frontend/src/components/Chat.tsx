import React, { useState } from 'react';

import { useSession } from '@data';

type messagesType = {
  id: string;
  prompt: string;
  response: string;
};

export const Chat = () => {
  const [messages, setMessage] = useState<messagesType[]>([]);
  const [pending, setPending] = useState(false);
  const { responsedata } = useSession();
  const { zoneId } = responsedata;

  //responsedata.id
  const submitAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    console.log('zoneId:', zoneId);

    const form = e.currentTarget;
    const promptValue = form.prompt.value;

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
      throw new Error(`API Fetch error:: ${err}`);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <form className='mb-4 grid gap-4' onSubmit={submitAction}>
        <input
          type='text'
          name='prompt'
          placeholder={`
          ${pending ? 'Die KI denkt nach...' : 'Stell noch eine Frage...'}`}
          className='input input-primary'
          disabled={pending}
        />
      </form>

      {messages.map((message) => (
        <div key={message.id} className='mb-4'>
          <div className='chat chat-start'>
            <div
              className={`chat-bubble chat-bubble-primary ${message.prompt ? 'visible' : 'invisible'}`}
            >
              {message.prompt}
            </div>
          </div>
          <div className='chat chat-end'>
            <div
              className={`chat-bubble chat-bubble-accent ${message.response ? 'visible' : 'invisible'}`}
            >
              {message.response}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
