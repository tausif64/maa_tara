import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading2, Heading3, Heading4, Pilcrow,
    List, ListOrdered, Quote, Code, Minus,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link as LinkIcon, Unlink, Image as ImageIcon,
    Undo, Redo, UploadCloud
} from 'lucide-react';

interface Props {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Write your inspiring article here...' }: Props) {
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-orange-600 hover:text-orange-700 underline font-medium cursor-pointer',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full my-4 shadow-md mx-auto block',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap p-4 min-h-[320px] focus:outline-hidden text-gray-800',
            },
        },
    });

    if (!editor) {
        return <div className="h-64 border border-gray-200 rounded-xl animate-pulse bg-gray-50 flex items-center justify-center text-gray-400">Loading editor...</div>;
    }

    const openLinkModal = () => {
        const previousUrl = editor.getAttributes('link').href || '';
        setLinkUrl(previousUrl);
        setLinkModalOpen(true);
    };

    const handleSetLink = () => {
        if (!linkUrl) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            let url = linkUrl;
            if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
                url = 'https://' + url;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        setLinkModalOpen(false);
        setLinkUrl('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Get CSRF token
            const csrfMeta = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/admin/blog/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfMeta || '',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    editor.chain().focus().setImage({ src: data.url }).run();
                }
            } else {
                alert('Image upload failed. Please verify file size is within 10MB.');
            }
        } catch (err) {
            console.error('Error uploading image', err);
            alert('An error occurred while uploading the image.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handlePromptImageUrl = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
    const charCount = editor.getText().length;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 text-gray-700">
                {/* Text Styles */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        editor.isActive('paragraph') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Normal Paragraph"
                >
                    <Pilcrow size={15} /> P
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        editor.isActive('heading', { level: 2 }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Heading 2"
                >
                    <Heading2 size={15} /> H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        editor.isActive('heading', { level: 3 }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Heading 3"
                >
                    <Heading3 size={15} /> H3
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        editor.isActive('heading', { level: 4 }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Heading 4"
                >
                    <Heading4 size={15} /> H4
                </button>

                <span className="w-px h-5 bg-gray-300 mx-1" />

                {/* Formats */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('bold') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Bold"
                >
                    <Bold size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('italic') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Italic"
                >
                    <Italic size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('underline') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Underline"
                >
                    <UnderlineIcon size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('strike') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Strikethrough"
                >
                    <Strikethrough size={15} />
                </button>

                <span className="w-px h-5 bg-gray-300 mx-1" />

                {/* Lists & Quotes */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('bulletList') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Bullet List"
                >
                    <List size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('orderedList') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Numbered List"
                >
                    <ListOrdered size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('blockquote') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Blockquote"
                >
                    <Quote size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('codeBlock') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Code Block"
                >
                    <Code size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-700 transition-colors"
                    title="Horizontal Line"
                >
                    <Minus size={15} />
                </button>

                <span className="w-px h-5 bg-gray-300 mx-1" />

                {/* Alignment */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive({ textAlign: 'left' }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Align Left"
                >
                    <AlignLeft size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive({ textAlign: 'center' }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Align Center"
                >
                    <AlignCenter size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive({ textAlign: 'right' }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Align Right"
                >
                    <AlignRight size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive({ textAlign: 'justify' }) ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Align Justify"
                >
                    <AlignJustify size={15} />
                </button>

                <span className="w-px h-5 bg-gray-300 mx-1" />

                {/* Links & Media */}
                <button
                    type="button"
                    onClick={openLinkModal}
                    className={`p-1.5 rounded-lg transition-colors ${
                        editor.isActive('link') ? 'bg-white text-orange-600 shadow-xs' : 'hover:bg-gray-200/70 text-gray-700'
                    }`}
                    title="Insert / Edit Link"
                >
                    <LinkIcon size={15} />
                </button>
                {editor.isActive('link') && (
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="p-1.5 rounded-lg hover:bg-gray-200/70 text-red-500 transition-colors"
                        title="Remove Link"
                    >
                        <Unlink size={15} />
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-700 transition-colors flex items-center gap-1 text-xs"
                    title="Upload Inline Image"
                >
                    {isUploading ? <UploadCloud size={15} className="animate-spin text-orange-600" /> : <ImageIcon size={15} />}
                    <span>Upload</span>
                </button>
                <button
                    type="button"
                    onClick={handlePromptImageUrl}
                    className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-500 hover:text-gray-800 transition-colors text-xs"
                    title="Insert Image by URL"
                >
                    URL
                </button>

                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-500 disabled:opacity-30 transition-colors"
                        title="Undo"
                    >
                        <Undo size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-1.5 rounded-lg hover:bg-gray-200/70 text-gray-500 disabled:opacity-30 transition-colors"
                        title="Redo"
                    >
                        <Redo size={15} />
                    </button>
                </div>
            </div>

            {/* Link Modal */}
            {linkModalOpen && (
                <div className="bg-orange-50 border-b border-orange-200 p-2.5 flex items-center gap-2">
                    <LinkIcon size={16} className="text-orange-600 shrink-0" />
                    <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com or /slug"
                        className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-orange-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSetLink();
                            } else if (e.key === 'Escape') {
                                setLinkModalOpen(false);
                            }
                        }}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={handleSetLink}
                        className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs font-semibold hover:bg-orange-700"
                    >
                        Apply
                    </button>
                    <button
                        type="button"
                        onClick={() => setLinkModalOpen(false)}
                        className="px-2 py-1.5 text-xs text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Editor Area */}
            <div className="min-h-[320px] bg-white cursor-text" onClick={() => editor.commands.focus()}>
                <EditorContent editor={editor} />
            </div>

            {/* Status / Word Count Footer */}
            <div className="bg-gray-50/80 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
                <span>TipTap Rich Engine</span>
                <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                </div>
            </div>
        </div>
    );
}
