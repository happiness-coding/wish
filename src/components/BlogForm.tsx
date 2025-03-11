// src/components/BlogForm.tsx
import { FC, useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import { BlogPost } from '../models/BlogPost';

interface BlogFormProps {
  initialPost?: Partial<BlogPost>;
  onSave: (post: Partial<BlogPost>) => void;
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button.attrs<{ primary?: boolean }>(props => ({
  // Convert boolean prop to string attribute for HTML compliance
  type: props.type || 'button',
  // Don't pass the primary prop to the DOM element
  primary: undefined
}))<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${props => props.primary ? '#4299e1' : '#e2e8f0'};
  color: ${props => props.primary ? '#fff' : '#4a5568'};

  &:hover {
    background-color: ${props => props.primary ? '#3182ce' : '#cbd5e0'};
  }
`;


export const BlogForm: FC<BlogFormProps> = ({ initialPost = {}, onSave }) => {
  const [title, setTitle] = useState(initialPost.title || '');
  const [author, setAuthor] = useState(initialPost.author || '');
  const [content, setContent] = useState(initialPost.content || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setAuthor(initialPost.author || '');
      setContent(initialPost.content || '');
    }
  }, [initialPost]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({ title, author, content });
  };

  return (
    <FormContainer>
      <FormHeader>{initialPost?.id ? 'Edit Blog Post' : 'Create New Blog Post'}</FormHeader>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Content *</Label>
          <Editor
              apiKey="gthtuo29jdumjtcljchc4b8jjmouyg14ps0qgzkyrabtvwgm"
              value={content}
              onEditorChange={(newValue) => setContent(newValue)}
              init={{
                height: 500,
                menubar: true,

                // Specify the full cloud location
                suffix: '.min',
                base_url: 'https://cdn.tiny.cloud/1/gthtuo29jdumjtcljchc4b8jjmouyg14ps0qgzkyrabtvwgm/tinymce/7.7.1',

                // Use standard plugins list instead of external_plugins
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],

                toolbar: 'undo redo | blocks | bold italic underline | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | link image media | ' +
                    'removeformat | fullscreen code help',
                images_upload_url: '/api/upload-image',
                automatic_uploads: true,
                file_picker_types: 'image media file',
                file_picker_callback: (callback, _value, meta) => {
                  // File picker code remains the same
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');

                  if (meta.filetype === 'image') {
                    input.setAttribute('accept', 'image/*');
                  } else if (meta.filetype === 'media') {
                    input.setAttribute('accept', 'video/*,audio/*');
                  } else {
                    input.setAttribute('accept', '.pdf,.doc,.docx,.zip');
                  }

                  input.onchange = () => {
                    if (!input.files || !input.files[0]) return;

                    const file = input.files[0];
                    const reader = new FileReader();

                    reader.onload = () => {
                      const id = 'blobid' + (new Date()).getTime();
                      const editor = tinymce.activeEditor;

                      if (editor) {
                        const blobCache = editor.editorUpload.blobCache;
                        const base64 = (reader.result as string).split(',')[1];
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);

                        callback(blobInfo.blobUri(), { title: file.name });
                      }
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                },
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
                image_advtab: true,
                image_caption: true
              }}
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={() => navigate('/blogs')}>
            Cancel
          </Button>
          <Button type="submit" primary>
            Save
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};