// src/components/BlogForm.tsx
import {FC, useState, FormEvent, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BlogPost } from '../models/BlogPost';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface BlogFormProps {
  initialPost?: Partial<BlogPost>;
  onSave: (post: Partial<BlogPost>) => void;
}

const PageContainer = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2.5rem 1rem;
`;

const FormContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const FormHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
`;

const FormSubtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: #ffffff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 3rem;
  justify-content: flex-end;
`;

const Button = styled.button.attrs<{ primary?: boolean }>(props => ({
  type: props.type || 'button',
  primary: undefined
}))<{ primary?: boolean }>`
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  background-color: ${props => props.primary ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.primary ? '#fff' : '#475569'};
  box-shadow: ${props => props.primary ? '0 4px 6px rgba(59, 130, 246, 0.15)' : 'none'};

  &:hover {
    background-color: ${props => props.primary ? '#2563eb' : '#e2e8f0'};
    transform: ${props => props.primary ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.primary ? '0 6px 10px rgba(59, 130, 246, 0.2)' : 'none'};
  }
`;

const EditorWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  .tox-tinymce {
    border: none !important;
    border-radius: 8px;
  }

  .tox-statusbar {
    border-top: 1px solid #f1f5f9 !important;
  }
`;

export const BlogForm: FC<BlogFormProps> = ({ initialPost = {}, onSave }) => {
  const [title, setTitle] = useState(initialPost.title || '');
  const [author, setAuthor] = useState(initialPost.author || '');
  const [content, setContent] = useState(initialPost.content || '');
  const navigate = useNavigate();
  const [, setIsEditorLoaded] = useState(false);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setAuthor(initialPost.author || '');
      setContent(initialPost.content || '');
    }
  }, [initialPost]);

    const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title for your blog post');
      return;
    }

    if (!author.trim()) {
      alert('Please enter an author name');
      return;
    }

    // Get content from editor reference
    const editorContent = content ||
      (editorRef.current && typeof editorRef.current.getContent === 'function'
        ? editorRef.current.getContent()
        : '');

    if (!editorContent.trim()) {
      alert('Please enter some content for your blog post');
      return;
    }

    // Save with all fields properly populated
    onSave({
      title: title.trim(),
      author: author.trim(),
      content: editorContent
    });
  };

    return (
        <PageContainer>
            <FormContainer>
                <FormHeader>
                    <FormTitle>{initialPost?.id ? 'Edit Your Blog Post' : 'Create New Blog Post'}</FormTitle>
                    <FormSubtitle>
                        {initialPost?.id
                            ? 'Update your blog post details and content below'
                            : 'Share your thoughts, ideas, and stories with the world'}
                    </FormSubtitle>
                </FormHeader>

                <form onSubmit={handleSubmit}>
                    <FormSection>
                        <SectionTitle>Post Details</SectionTitle>
                        <FormGroup>
                            <Label htmlFor="title">
                                Title<RequiredMark>*</RequiredMark>
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a compelling title for your post"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="author">
                                Author<RequiredMark>*</RequiredMark>
                            </Label>
                            <Input
                                id="author"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Your name or pen name"
                                required
                            />
                        </FormGroup>
                    </FormSection>

                    <FormSection>
                        <SectionTitle>Post Content</SectionTitle>
                        <FormGroup>
                            <Label htmlFor="content">
                                Content<RequiredMark>*</RequiredMark>
                            </Label>
                            <EditorWrapper>
                                <Editor
                                  apiKey="gthtuo29jdumjtcljchc4b8jjmouyg14ps0qgzkyrabtvwgm"
                                  onInit={(_, editor) => {
                                    editorRef.current = editor;
                                    setIsEditorLoaded(true);
                                  }}
                                  value={content}
                                  onEditorChange={(newValue) => setContent(newValue)}
                                  init={{
                                    height: 500,
                                    menubar: true,

                                    // Visual settings
                                    skin: "oxide",
                                    content_css: "default",
                                    branding: false,

                                    // Enhanced plugin configuration
                                    plugins: [
                                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                      'insertdatetime', 'media', 'table', 'help', 'wordcount',
                                      'codesample', 'quickbars'
                                    ],

                                    // Simplified toolbar with a cleaner organization
                                    toolbar: [
                                      { name: 'history', items: ['undo', 'redo'] },
                                      { name: 'styles', items: ['blocks'] },
                                      { name: 'formatting', items: ['bold', 'italic', 'underline'] },
                                      { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
                                      { name: 'lists', items: ['bullist', 'numlist', 'outdent', 'indent'] },
                                      { name: 'insertions', items: ['link', 'image', 'media'] },
                                      { name: 'enhancements', items: ['blockquote', 'codesample'] },
                                      { name: 'tools', items: ['removeformat', 'fullscreen', 'code'] }
                                    ],

                                    // Improved code sample settings
                                    codesample_global_prismjs: true,
                                    codesample_languages: [
                                      { text: 'JavaScript', value: 'javascript' },
                                      { text: 'TypeScript', value: 'typescript' },
                                      { text: 'HTML/XML', value: 'markup' },
                                      { text: 'CSS', value: 'css' },
                                      { text: 'Python', value: 'python' },
                                      { text: 'Java', value: 'java' },
                                      { text: 'C#', value: 'csharp' },
                                      { text: 'PHP', value: 'php' },
                                      { text: 'SQL', value: 'sql' },
                                      { text: 'JSON', value: 'json' }
                                    ],

                                    // Modern styles for content elements
                                    content_style: `
                                      body {
                                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 1.8;
                                        padding: 12px;
                                        color: #334155;
                                      }
                                      
                                      /* Modern blockquote style */
                                      blockquote {
                                        border-left: 5px solid #3b82f6;
                                        margin: 1.5em 0;
                                        padding: 1em 1.5em;
                                        background-color: #f0f9ff;
                                        border-radius: 0 8px 8px 0;
                                        font-style: italic;
                                        color: #334155;
                                        position: relative;
                                        box-shadow: 0 2px 4px rgba(0,0,0,0.04);
                                      }
                                      
                                      /* Beautiful code blocks */
                                      .mce-content-body pre[class*="language-"] {
                                        border-radius: 8px;
                                        padding: 1em;
                                        margin: 1.5em 0;
                                        background: #1e293b;
                                        color: #e2e8f0;
                                        overflow: auto;
                                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                        font-family: "JetBrains Mono", "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", monospace;
                                      }
                                      
                                      /* Code block header */
                                      .mce-content-body pre[class*="language-"]::before {
                                        content: attr(class);
                                        content: attr(data-language);
                                        display: block;
                                        background: rgba(255,255,255,0.1);
                                        padding: 0.3em 1em;
                                        margin: -1em -1em 1em -1em;
                                        border-radius: 8px 8px 0 0;
                                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                                        font-size: 0.85em;
                                        text-transform: uppercase;
                                        letter-spacing: 0.05em;
                                      }
                                      
                                      /* Inline code */
                                      code:not([class*="language-"]) {
                                        background: #f1f5f9;
                                        padding: 0.2em 0.4em;
                                        border-radius: 4px;
                                        font-family: "JetBrains Mono", "SF Mono", Monaco, Menlo, Consolas, monospace;
                                        font-size: 0.9em;
                                        color: #dc2626;
                                      }
                                    `,

                                    // Quick formatting toolbar
                                    quickbars_selection_toolbar: 'bold italic | blockquote codesample | h2 h3 | link',
                                    quickbars_insert_toolbar: 'image table codesample',

                                    // Better image handling
                                    image_advtab: true,
                                    image_caption: true,
                                    image_dimensions: false,

                                    // Modern file picker
                                    file_picker_types: 'image',
                                    file_picker_callback: (callback) => {
                                      const input = document.createElement('input');
                                      input.setAttribute('type', 'file');
                                      input.setAttribute('accept', 'image/*');

                                      input.onchange = () => {
                                        if (!input.files) return;
                                        const file = input.files[0];

                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          const id = 'blobid' + new Date().getTime();
                                          const blobCache = editorRef.current?.editorUpload.blobCache;
                                          const base64 = (reader.result as string).split(',')[1];

                                          if (blobCache) {
                                            const blobInfo = blobCache.create(id, file, base64);
                                            callback(blobInfo.blobUri(), { title: file.name });
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      };

                                      input.click();
                                    }
                                  }}
                                />
                            </EditorWrapper>
                        </FormGroup>
                    </FormSection>

                    <ButtonGroup>
                        <Button type="button" onClick={() => navigate('/blogs')}>
                            Cancel
                        </Button>
                        <Button type="submit" primary>
                            {initialPost?.id ? 'Update Post' : 'Publish Post'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormContainer>
        </PageContainer>
    );
};