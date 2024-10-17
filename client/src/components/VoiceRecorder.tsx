import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { FaMicrophone } from 'react-icons/fa';

interface VoiceRecorderProps {
  onStop: (blobUrl: string, blob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onStop }) => {
  return (
    <ReactMediaRecorder
      audio
      onStop={(blobUrl, blob) => onStop(blobUrl, blob)}
      render={({ status, startRecording, stopRecording }) => (
        <button
          onClick={status === 'recording' ? stopRecording : startRecording}
          className="flex items-center bg-gray-300 p-2 rounded"
        >
          <FaMicrophone className="text-gray-600" />
          {status === 'recording' ? 'Stop' : 'Record'}
        </button>
      )}
    />
  );
};

export default VoiceRecorder;
