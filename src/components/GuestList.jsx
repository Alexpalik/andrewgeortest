"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import CodeTool from "@editorjs/code";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import Raw from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';

class CustomImageTool {
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
      hidden: true
    };
  }

  static get isInline() {
    return false;
  }

  constructor({data, config, api}) {
    this.data = {
      url: data.url || '',
      meta: config.meta || {}
    };
    this.wrapper = undefined;
    this.api = api;
    this.config = config;

    // Check if there's already an image block
    this.hasExistingImage = false;
    const blocks = this.api.blocks.getBlocksCount();
    for (let i = 0; i < blocks; i++) {
      const block = this.api.blocks.getBlockByIndex(i);
      if (block && block.name === 'customImage') {
        this.hasExistingImage = true;
        break;
      }
    }
  }

  static get sanitize() {
    return {
      url: {}
    };
  }

  async uploadImage(file) {
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${this.config.uuid}/invitation/upload-image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload image');
      }

      const result = await response.json();
      return result.image_url || result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl) {
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${this.config.uuid}/invitation/delete-image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image_url: imageUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete image');
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  render() {
    if (this.hasExistingImage && !this.data.url) {
      // If there's already an image and this is a new block, remove it
      setTimeout(() => {
        this.api.blocks.delete();
      }, 0);
      return document.createElement('div');
    }

    this.wrapper = document.createElement('div');
    this.wrapper.style.textAlign = 'center';
    this.wrapper.style.margin = '0';
    this.wrapper.style.padding = '0';
    this.wrapper.style.width = '100%';
    this.wrapper.style.position = 'relative';

    if (this.data.url) {
      // If we have a URL, show the image
      const imageContainer = document.createElement('div');
      imageContainer.style.width = '100%';
      imageContainer.style.height = '300px';
      imageContainer.style.position = 'relative';
      imageContainer.style.overflow = 'hidden';
      
      const image = document.createElement('img');
      image.src = this.data.url;
      image.style.width = '100%';
      image.style.height = '100%';
      image.style.objectFit = 'cover';
      image.style.display = 'block';
      
      // Add delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '✕';
      deleteBtn.style.position = 'absolute';
      deleteBtn.style.right = '10px';
      deleteBtn.style.top = '10px';
      deleteBtn.style.padding = '8px';
      deleteBtn.style.background = 'rgba(0, 0, 0, 0.6)';
      deleteBtn.style.color = 'white';
      deleteBtn.style.border = 'none';
      deleteBtn.style.borderRadius = '4px';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.zIndex = '10';
      
      deleteBtn.addEventListener('click', async () => {
        try {
          deleteBtn.disabled = true;
          deleteBtn.innerHTML = '...';
          
          await this.deleteImage(this.data.url);
          
          this.data.url = '';
          this.wrapper.innerHTML = '';
          this.showFileUploader();
        } catch (error) {
          alert('Failed to delete image: ' + error.message);
          deleteBtn.disabled = false;
          deleteBtn.innerHTML = '✕';
        }
      });

      imageContainer.appendChild(image);
      imageContainer.appendChild(deleteBtn);
      this.wrapper.appendChild(imageContainer);
    } else {
      // If no URL, show file upload
      this.showFileUploader();
    }
    
    return this.wrapper;
  }

  showFileUploader() {
    const uploadContainer = document.createElement('div');
    uploadContainer.style.padding = '20px';
    uploadContainer.style.backgroundColor = '#f9f9f9';
    uploadContainer.style.border = '2px dashed #ccc';
    uploadContainer.style.borderRadius = '8px';
    uploadContainer.style.textAlign = 'center';
    uploadContainer.style.cursor = 'pointer';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    const button = document.createElement('button');
    button.innerHTML = 'Click to Upload Image';
    button.style.padding = '10px 20px';
    button.style.background = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    input.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          button.disabled = true;
          button.innerHTML = 'Uploading...';
          
          const imageUrl = await this.uploadImage(file);
          this.data.url = imageUrl;
          this.wrapper.innerHTML = '';
          
          const imageContainer = document.createElement('div');
          imageContainer.style.width = '100%';
          imageContainer.style.height = '300px';
          imageContainer.style.position = 'relative';
          imageContainer.style.overflow = 'hidden';
          
          const image = document.createElement('img');
          image.src = this.data.url;
          image.style.width = '100%';
          image.style.height = '100%';
          image.style.objectFit = 'cover';
          image.style.display = 'block';
          
          // Add delete button
          const deleteBtn = document.createElement('button');
          deleteBtn.innerHTML = '✕';
          deleteBtn.style.position = 'absolute';
          deleteBtn.style.right = '10px';
          deleteBtn.style.top = '10px';
          deleteBtn.style.padding = '8px';
          deleteBtn.style.background = 'rgba(0, 0, 0, 0.6)';
          deleteBtn.style.color = 'white';
          deleteBtn.style.border = 'none';
          deleteBtn.style.borderRadius = '4px';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.style.zIndex = '10';
          
          deleteBtn.addEventListener('click', async () => {
            try {
              deleteBtn.disabled = true;
              deleteBtn.innerHTML = '...';
              
              await this.deleteImage(this.data.url);
              
              this.data.url = '';
              this.wrapper.innerHTML = '';
              this.showFileUploader();
            } catch (error) {
              alert('Failed to delete image: ' + error.message);
              deleteBtn.disabled = false;
              deleteBtn.innerHTML = '✕';
            }
          });

          imageContainer.appendChild(image);
          imageContainer.appendChild(deleteBtn);
          this.wrapper.appendChild(imageContainer);
        } catch (error) {
          alert('Failed to upload image: ' + error.message);
          button.disabled = false;
          button.innerHTML = 'Click to Upload Image';
        }
      }
    });

    button.addEventListener('click', () => {
      input.click();
    });

    uploadContainer.appendChild(button);
    uploadContainer.appendChild(input);
    this.wrapper.appendChild(uploadContainer);
  }

  save() {
    return {
      url: this.data.url,
      meta: this.data.meta
    };
  }
}

class CustomButtonTool {
  static get toolbox() {
    return {
      title: 'Button',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><text x="12" y="13" text-anchor="middle" font-size="10" fill="currentColor">BTN</text></svg>'
    };
  }

  constructor({data, api}) {
    this.data = {
      text: data.text || 'See Registry',
      link: data.link || '#'
    };
    this.api = api;
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.textAlign = 'center';
    this.wrapper.style.margin = '40px 0';
    this.wrapper.style.marginTop = '60px';

    const button = document.createElement('button');
    button.style.backgroundColor = 'transparent';
    button.style.border = '2px solid currentColor';
    button.style.color = 'inherit';
    button.style.padding = '12px 24px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '4px';
    button.style.transition = 'all 0.3s ease';
    button.style.display = 'inline-block';
    button.style.minWidth = '150px';
    button.textContent = this.data.text;

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(0,0,0,0.05)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'transparent';
    });

    // Make button text editable
    button.contentEditable = true;
    button.style.outline = 'none';
    button.addEventListener('focus', () => {
      button.style.outline = '2px solid rgba(59, 130, 246, 0.5)';
      button.style.outlineOffset = '2px';
    });
    
    button.addEventListener('blur', () => {
      button.style.outline = 'none';
      // Trim any extra whitespace
      button.textContent = button.textContent.trim();
      this.data.text = button.textContent;
    });

    button.addEventListener('input', () => {
      this.data.text = button.textContent;
    });

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        button.blur();
      }
    });

    this.wrapper.appendChild(button);
    return this.wrapper;
  }

  save() {
    return {
      text: this.data.text,
      link: this.data.link
    };
  }
}

class HiddenTextBlock {
  static get toolbox() {
    return {
      title: 'Hidden Text',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>'
    };
  }

  constructor({data}) {
    this.data = data || {};
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'none';
    wrapper.setAttribute('data-hidden-text', this.data.text || '');
    return wrapper;
  }

  save() {
    return {
      text: this.data.text || '',
      type: this.data.type || 'button_text'
    };
  }
}

const GuestListPage = () => {
  const { uuid } = useParams();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newGuest, setNewGuest] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [selectedColor, setSelectedColor] = useState('#EBF8FF');
  const [buttonText, setButtonText] = useState('See Registry');
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [invitationCreated, setInvitationCreated] = useState(false);
  const editorRef = useRef(null);

  const colorPalette = [
    { name: 'Light Blue', value: '#EBF8FF', textColor: '#1E40AF' },
    { name: 'Light Yellow', value: '#FEF9C3', textColor: '#92400E' },
    { name: 'Light Pink', value: '#FCE7F3', textColor: '#BE185D' },
    { name: 'Light Green', value: '#ECFDF5', textColor: '#065F46' },
    { name: 'Light Purple', value: '#F3E8FF', textColor: '#6B21A8' },
    { name: 'Light Orange', value: '#FFF7ED', textColor: '#C2410C' },
    { name: 'Light Gray', value: '#F9FAFB', textColor: '#374151' },
    { name: 'Light Indigo', value: '#EEF2FF', textColor: '#3730A3' },
    { name: 'Light Rose', value: '#FFF1F2', textColor: '#BE123C' },
    { name: 'Light Teal', value: '#F0FDFA', textColor: '#0F766E' },
    { name: 'Light Cyan', value: '#ECFEFF', textColor: '#0E7490' },
    { name: 'Light Lime', value: '#F7FEE7', textColor: '#365314' },
    { name: 'Cream', value: '#FFFBEB', textColor: '#78350F' },
    { name: 'Lavender', value: '#F5F3FF', textColor: '#5B21B6' },
    { name: 'Peach', value: '#FBBF24', textColor: '#92400E' },
    { name: 'Mint', value: '#D1FAE5', textColor: '#064E3B' },
    { name: 'Sky', value: '#DBEAFE', textColor: '#1E3A8A' },
    { name: 'Coral', value: '#FEE2E2', textColor: '#991B1B' },
    { name: 'Sand', value: '#F3E8A6', textColor: '#78350F' },
    { name: 'Pearl', value: '#F3F4F6', textColor: '#374151' },
    { name: 'Blush', value: '#FECACA', textColor: '#7F1D1D' },
    { name: 'Sage', value: '#D9F99D', textColor: '#365314' },
    { name: 'Lilac', value: '#E9D5FF', textColor: '#6B21A8' },
    { name: 'Champagne', value: '#F7E98E', textColor: '#713F12' }
  ];

  const getTemplates = () => ({
    template1: {
      blocks: [
        {
          type: "customImage",
          data: {
            url: "https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png"
          }
        },
        {
          type: "header",
          data: {
            text: "Welcome to Our Registry",
            level: 2,
            alignment: "center"
          }
        },
        {
          type: "paragraph",
          data: {
            text: "We're excited to share this special moment with you. Your presence in our lives means the world to us, and we can't wait to celebrate together. Thank you for being part of our journey and for all the love and support you've shown us along the way.",
            alignment: "center"
          }
        },
        {
          type: "hiddenText",
          data: {
            text: buttonText,
            type: "button_text"
          }
        }
      ],
      version: "2.31.0-rc.7",
      meta: {
        backgroundColor: selectedColor,
      }
    },
    template2: {
      blocks: [
        {
          type: "customImage",
          data: {
            url: "https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/original/image-manager/hero-image-events-to-celebrate-1.png?t=1699618332"
          }
        },
        {
          type: "header",
          data: {
            text: "Join Us in Celebration",
            level: 2,
            alignment: "center"
          }
        },
        {
          type: "paragraph",
          data: {
            text: "We would be honored to have you join us for this special occasion. As we embark on this new chapter, your presence would make our celebration complete. We look forward to creating beautiful memories together and sharing in the joy of this momentous day.",
            alignment: "center"
          }
        },
        {
          type: "hiddenText",
          data: {
            text: buttonText,
            type: "button_text"
          }
        }
      ],
      version: "2.31.0-rc.7",
      meta: {
        backgroundColor: selectedColor,
        button_text: buttonText
      }
    }
  });

  const templates = getTemplates();

  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    if (editorRef.current) {
      const templates = getTemplates();
      const templateData = {
        time: Date.now(),
        backgroundColor: selectedColor,
        blocks: templates[templateId].blocks,
        version: "2.31.0-rc.7",
      };

      try {
        // Destroy the current instance
        await editorRef.current.destroy();
        
        // Create a new instance with the template data
        editorRef.current = new EditorJS({
          holder: "editorjs",
          autofocus: true,
          data: templateData,
          tools: {
            header: {
              class: Header,
              config: {
                defaultAlignment: 'center',
                levels: [1, 2, 3],
                placeholder: 'Enter a header',
                meta: templateData.meta
              }
            },
            paragraph: {
              inlineToolbar: true,
              config: {
                defaultAlignment: 'center',
                placeholder: 'Enter text here',
                preserveBlank: true,
                meta: templateData.meta
              }
            },
            customImage: {
              class: CustomImageTool,
              config: {
                uuid: uuid,
                meta: templateData.meta
              }
            },
            customButton: CustomButtonTool,
            hiddenText: HiddenTextBlock
          }
        });

        // Update the editor background color
        const editorElement = document.getElementById("editorjs");
        if (editorElement) {
          editorElement.style.backgroundColor = selectedColor;
        }
      } catch (error) {
        console.error('Error updating template:', error);
      }
    }
  };

  const handleColorChange = async (color) => {
    setSelectedColor(color);
    if (editorRef.current) {
      const templates = getTemplates();
      const templateData = {
        time: Date.now(),
        backgroundColor: color,
        blocks: templates[selectedTemplate].blocks,
        version: "2.31.0-rc.7",
      };

      try {
        // Destroy the current instance
        await editorRef.current.destroy();
        
        // Create a new instance with the updated color
        editorRef.current = new EditorJS({
          holder: "editorjs",
          autofocus: true,
          data: templateData,
          tools: {
            header: {
              class: Header,
              config: {
                defaultAlignment: 'center',
                levels: [1, 2, 3],
                placeholder: 'Enter a header',
                meta: templateData.meta
              }
            },
            paragraph: {
              inlineToolbar: true,
              config: {
                defaultAlignment: 'center',
                placeholder: 'Enter text here',
                preserveBlank: true,
                meta: templateData.meta
              }
            },
            customImage: {
              class: CustomImageTool,
              config: {
                uuid: uuid,
                meta: templateData.meta
              }
            },
            customButton: CustomButtonTool,
            hiddenText: HiddenTextBlock
          }
        });

        // Update the editor background color
        const editorElement = document.getElementById("editorjs");
        if (editorElement) {
          editorElement.style.backgroundColor = color;
        }
      } catch (error) {
        console.error('Error updating color:', error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timeout = setTimeout(() => {
        if (!editorRef.current && document.getElementById("editorjs")) {
          editorRef.current = new EditorJS({
            holder: "editorjs",
            autofocus: true,
            placeholder: "Write your invitation...",
            data: {
              time: Date.now(),
              blocks: [],
              version: "2.31.0-rc.7",
              meta: {
                backgroundColor: selectedColor,
                button_text: buttonText
              }
            },
            tools: {
              header: Header,
              list: List,
              quote: Quote,
              checklist: Checklist,
              delimiter: Delimiter,
              code: CodeTool,
              table: Table,
              marker: Marker,
              embed: Embed,
              customImage: {
                class: CustomImageTool,
                config: {
                  uuid: uuid
                }
              },
              customButton: CustomButtonTool,
              hiddenText: HiddenTextBlock
            },
          });
        }
      }, 300);
  
      return () => clearTimeout(timeout);
    }
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/guests/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch guests");

      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) fetchGuests();
  }, [uuid]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timeout = setTimeout(() => {
        if (!editorRef.current && document.getElementById("editorjs")) {
          editorRef.current = new EditorJS({
            holder: "editorjs",
            autofocus: true,
            placeholder: "Write your invitation...",
            tools: {
              header: Header,
              list: List,
              quote: Quote,
              checklist: Checklist,
              delimiter: Delimiter,
              code: CodeTool,
              table: Table,
              marker: Marker,
              embed: Embed,
              customImage: {
                class: CustomImageTool,
                config: {
                  uuid: uuid,
                  meta: {
                    backgroundColor: selectedColor,
                    button_text: buttonText
                  }
                }
              },
              customButton: CustomButtonTool,
              hiddenText: HiddenTextBlock
            },
          });
        }
      }, 300);
  
      return () => clearTimeout(timeout);
    }
  }, []);
  
  const handleCreateInvitation = async () => {
    if (!editorRef.current) {
      console.log('EditorRef is not initialized');
      return;
    }
    
    console.log('Creating invitation...');
    setSending(true);

    try {
      const output = await editorRef.current.save();
      
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        alert('Please log in to create an invitation');
        return;
      }

      const requestBody = {
        email_cta: buttonText || "Click to join",
        email_body: {
          backgroundColor: selectedColor,
          blocks: output.blocks
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      console.log('API endpoint:', `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/`);

      const res = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errorData = await res.json();
        
        // If invitation already exists, treat it as success and show send button
        if (errorData.detail === "RegistryInvitation already exists.") {
          setSuccessMessage('Invitation template already exists. You can now send invitations!');
          setInvitationCreated(true);
          
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
          
          return;
        }
        
        throw new Error(errorData.detail || 'Failed to create invitation');
      }

      const result = await res.json();
      console.log('Invitation created:', result);
      
      setSuccessMessage('Invitation template created successfully! (Testing mode - not actually created)');
      setInvitationCreated(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      console.error('Error creating invitation:', err);
      alert('Failed to create invitation: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleAddGuest = async () => {
    const token = sessionStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
    );
    if (!token) return;
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/guests/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newGuest)
        }
      );
  
      if (!res.ok) {
        const error = await res.json();
        console.error("Add guest failed:", error);
        alert("Failed to add guest: " + (error.detail || res.statusText));
        return;
      }
  
      const createdGuest = await res.json();
      await fetchGuests();
      setNewGuest({ first_name: "", last_name: "", email: "", phone: "" });
      setSuccessMessage('Guest added successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      alert("Unexpected error: " + err.message);
    }
  };

  const handleSendInvitation = async () => {
    try {
      setSending(true);
      
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        alert('Please log in to send invitations');
        return;
      }

      // Send notifications to all guests
      const notificationBody = {
        email_notification: true,
        sms_notification: true,
        send_to: "all"
      };

      console.log('Notification request body:', JSON.stringify(notificationBody, null, 2));
      console.log('Notification API endpoint:', `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/notifications/`);

      // Commented out for testing purposes - not actually sending invitations
      /*
      const res = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/notifications/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(notificationBody)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to send invitations');
      }

      const result = await res.json();
      console.log('Invitations sent:', result);
      */
      
      // Simulate successful response for testing
      console.log('Simulated successful invitation send (not actually sent)');
      
      setSuccessMessage(`Invitations sent successfully to all guests! (Testing mode - not actually sent)`);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      console.error('Error sending invitations:', err);
      alert('Failed to send invitations: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-10">
      <div className="space-y-4">
        <h2 className="text-lg ">Add a New Guest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newGuest.first_name}
            onChange={(e) => setNewGuest({ ...newGuest, first_name: e.target.value })}
            placeholder="First name"
            className="border px-4 py-2 w-full"
          />
          <input
            type="text"
            value={newGuest.last_name}
            onChange={(e) => setNewGuest({ ...newGuest, last_name: e.target.value })}
            placeholder="Last name"
            className="border px-4 py-2 w-full"
          />
          <input
            type="email"
            value={newGuest.email}
            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
            placeholder="Guest email"
            className="border px-4 py-2 w-full"
          />
          <input
            type="text"
            value={newGuest.phone}
            onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
            placeholder="Guest phone"
            className="border px-4 py-2 w-full"
          />
        </div>
        <button
          onClick={handleAddGuest}
          className="bg-[rgb(6,59,103)] text-white px-4 py-2 hover:bg-[rgb(8,76,133)] transition-colors w-full sm:w-auto"
        >
          Add Guest
        </button>
      </div>

      {/* See All Guests Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowGuestsModal(true)}
          className="text-[rgb(6,59,103)] hover:text-[rgb(8,76,133)] font-medium flex items-center space-x-2"
        >
          <span>See All Guests</span>
          <span className="bg-[rgb(6,59,103)] text-white text-xs px-2 py-1 rounded-none">
            {guests.length}
          </span>
        </button>
      </div>

      <div className="relative py-6 sm:py-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-base text-gray-500">Invitation Section</span>
        </div>
      </div>

      <div className="mt-4 space-y-4" id="invitation-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl ">Write an Invitation</h2>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleTemplateChange('template1')}
              className={`p-4 border ${
                selectedTemplate === 'template1' 
                  ? 'border-[rgb(6,59,103)] bg-[rgba(6,59,103,0.1)]' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <img 
                src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png"
                alt="Template 1"
                className="w-full h-48 sm:h-32 object-cover mb-2"
              />
              <span className="text-sm font-medium">Classic Registry</span>
            </button>
            <button
              onClick={() => handleTemplateChange('template2')}
              className={`p-4 border ${
                selectedTemplate === 'template2' 
                  ? 'border-[rgb(6,59,103)] bg-[rgba(6,59,103,0.1)]' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <img 
                src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/original/image-manager/hero-image-events-to-celebrate-1.png?t=1699618332"
                alt="Template 2"
                className="w-full h-48 sm:h-32 object-cover mb-2"
              />
              <span className="text-sm font-medium">Celebration Event</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="relative">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const container = document.getElementById('color-carousel');
                  container.scrollBy({ left: -200, behavior: 'smooth' });
                }}
                className="p-2 rounded-none bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                aria-label="Previous colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div 
                id="color-carousel"
                className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {colorPalette.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`flex-shrink-0 w-10 h-10 rounded border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-gray-800 shadow-lg scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              
              <button
                onClick={() => {
                  const container = document.getElementById('color-carousel');
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
                className="p-2 rounded-none bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                aria-label="Next colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Custom Color
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-12 w-12 sm:h-10 sm:w-16 border-2 border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors"
                    title="Click to pick a custom color"
                  />
                  <input
                    type="text"
                    value={selectedColor.toUpperCase()}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Validate hex color format
                      if (/^#[0-9A-Fa-f]{0,6}$/i.test(value)) {
                        setSelectedColor(value);
                        if (value.length === 7) {
                          handleColorChange(value);
                        }
                      }
                    }}
                    placeholder="#FFFFFF"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-none text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={7}
                  />
                  <div 
                    className="w-12 h-12 sm:w-10 sm:h-10 rounded border-2 border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: selectedColor }}
                    title="Current color preview"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Use the color picker or enter a hex code (e.g., #FF5733)
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Enter button text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setButtonText('See registry')}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This text will be included in the invitation data
          </p>
        </div>

        <div style={{
          width: '600px',
          maxWidth: '100%',
          margin: '0 auto',
          backgroundColor: selectedColor,
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Invitation"
              style={{
                width: '100%',
                display: 'block',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4
              }}
            />
          )}
          <div
            id="editorjs"
            className="border shadow-sm min-h-[200px]"
            style={{
              backgroundColor: 'transparent',
              border: 'none'
            }}
          />
        </div>

        <div className="flex justify-end mt-6">
          {!invitationCreated ? (
            <button
              onClick={handleCreateInvitation}
              disabled={sending}
              className="bg-[rgb(6,59,103)] text-white px-6 py-2 hover:bg-[rgb(8,76,133)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Creating..." : "Create Invitation"}
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCreateInvitation}
                disabled={sending}
                className="bg-gray-600 text-white px-6 py-2 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Updating..." : "Update Invitation"}
              </button>
              <button
                onClick={handleSendInvitation}
                disabled={sending || guests.length === 0}
                className="bg-[rgb(6,59,103)] text-white px-6 py-2 hover:bg-[rgb(8,76,133)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : `Send to ${guests.length} Guests`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Guests Modal */}
      {showGuestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-none max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl ">All Guests ({guests.length})</h2>
              <button
                onClick={() => setShowGuestsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading guests...</p>
                </div>
              ) : guests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No guests found.</p>
                  <p className="text-sm mt-2">Add your first guest using the form above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {guests.map((guest) => (
                    <div
                      key={guest.id}
                      className="border rounded-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {guest.first_name} {guest.last_name}
                          </h3>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {guest.email}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.5 11.5s-.5 2.5 2 5 5 2 5 2l2.103-3.724a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {guest.phone}
                            </p>
                            <p className="text-xs text-gray-400">
                              Joined: {new Date(guest.created_at).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Total guests: {guests.length}
                </p>
                <button
                  onClick={() => setShowGuestsModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-none flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-800 ml-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestListPage;