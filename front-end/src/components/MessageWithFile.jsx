import React from 'react'
import { useState } from 'react';
import style from '../css/components/MessageWithFile.module.css'
const MessageWithFile = ({ message }) => {
    const [previewError, setPreviewError] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleDownload = async (e, fileData) => {
        e.preventDefault();
        setLoading(true);
        try {
            const link = document.createElement('a');
            link.href = fileData.data;
            link.download = fileData.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            setPreviewError(true);
        } finally {
            setLoading(false);
        }
    };


    // Handle image loading errors
    const handleImageError = () => {
        setPreviewError(true);
    };

    if (!message) return null;

    // If the message has file data, handle different file types
    if (message.fileData) {
        const { type, data, name } = message.fileData;

        // Handle images
        if (type.startsWith('image/')) {
            return previewError ? (
                <div className={style.file_message}>
                    <span>🖼️ Image: {name}</span>
                    <a href={data} download={name} className={style.download_link}>
                        Download
                    </a>
                </div>
            ) : (
                <div className={style.image_preview}>
                    <img
                        src={data}
                        alt={name}
                        onError={handleImageError}
                        style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '8px'
                        }}
                    />
                    <div className={style.image_caption}>{name}</div>
                </div>
            );
        }

        // Handle PDFs
        if (type === 'application/pdf') {
            return (
                <div className={style.file_message}>
                    {loading ? (
                        <span>Downloading...</span>
                    ) : (
                        <div>
                    <span>📄 PDF: {name}</span>
                    <a href={data} download={name} className={style.download_link}>
                        Download PDF
                    </a></div>
                )}
                </div>
            );
        }

        // Handle other file types
        const fileIcon = {
            'application/zip': '🗄️',
            'application/x-zip-compressed': '🗄️',
            'text/plain': '📝',
            'application/msword': '📘',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📘',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'audio/mpeg': '🎵',
            'audio/wav': '🎵',
            'video/mp4': '🎥',
        }[type] || '📎';

        return (
            <div className={style.file_message}>
                <span>{fileIcon} {name}</span>
                <a href={data} download={name} className={style.download_link}>
                    Download File
                </a>
            </div>
        );
    }

    // If no file data, render regular message content
    return <span className={style.message_text}>{message.content}</span>;
};


export default MessageWithFile
