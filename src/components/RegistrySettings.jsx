"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import SidebarFilters from "@/components/SidebarFilters";
import { fetchWishlist } from "@/app/lib/fetchWishlist";
import { fetchProductInfo } from "@/app/lib/fetchProductById";
import { RegistryPageSkeleton } from "@/components/LoadingSkeleton";
import PhoneInput from "@/components/PhoneInput";
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

// Add custom CSS for better mobile experience
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(style);
}

// Simple circular progress chart component
const CircularProgress = ({ percentage, label, value, color = "#3B82F6" }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-3">
        <svg
          className="w-24 h-24 transform -rotate-90"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">{value}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-800 text-center leading-tight">{label}</p>
    </div>
  );
};

// Custom EditorJS Tools (same as in GuestList.jsx)
class CustomImageTool {
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  static get isInline() {
    return false;
  }

  constructor({data, config, api}) {
    console.log('CustomImageTool constructor called with:', { data, config });
    
    this.data = {
      url: data.url || data.file?.url || '',
      meta: config.meta || {}
    };
    this.wrapper = undefined;
    this.api = api;
    this.config = config;
    
    console.log('CustomImageTool initialized with data:', this.data);
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
      const imageUrl = result.image_url || result.url;
      
      // Update the imageUrl state
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('imageUploaded', { detail: { imageUrl } });
        window.dispatchEvent(event);
      }
      
      return imageUrl;
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
    console.log('CustomImageTool render called with data:', this.data);
    
    this.wrapper = document.createElement('div');
    this.wrapper.style.textAlign = 'center';
    this.wrapper.style.margin = '0';
    this.wrapper.style.padding = '0';
    this.wrapper.style.width = '100%';
    this.wrapper.style.position = 'relative';

    // Check if we have a URL in the data
    const imageUrl = this.data.url || this.data.file?.url;
    console.log('Image URL found:', imageUrl);

    if (imageUrl) {
      // If we have a URL, show the image
      const imageContainer = document.createElement('div');
      imageContainer.style.width = '100%';
      imageContainer.style.height = '300px';
      imageContainer.style.position = 'relative';
      imageContainer.style.overflow = 'hidden';
      
      const image = document.createElement('img');
      image.src = imageUrl;
      image.style.width = '100%';
      image.style.height = '100%';
      image.style.objectFit = 'cover';
      image.style.display = 'block';
      
      // Handle image load errors
      image.onerror = () => {
        console.error('Failed to load image:', imageUrl);
        imageContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666;">
            <p>Failed to load image</p>
          </div>
        `;
      };
      
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
          
          await this.deleteImage(imageUrl);
          
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
      console.log('No image URL found, showing file uploader');
      // No URL, show file upload
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
    console.log('CustomImageTool save called, returning:', {
      url: this.data.url || this.data.file?.url,
      meta: this.data.meta
    });
    
    return {
      url: this.data.url || this.data.file?.url,
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
      text: data.text || 'See registry',
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

const RegistrySettings = () => {
  const { uuid } = useParams();
  
  // Color palette for invitation templates
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

  const [registry, setRegistry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [registryProducts, setRegistryProducts] = useState([]);
  const [transformedProducts, setTransformedProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [variantMap, setVariantMap] = useState({});
  const wishlistFetched = useRef(false);
  const greetingMessageRef = useRef(null);

  // Guest management state
  const [guests, setGuests] = useState([]);
  const [guestLoading, setGuestLoading] = useState(false);
  const [newGuest, setNewGuest] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [guestSuccessMessage, setGuestSuccessMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  // Invitation state
  const [sending, setSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [selectedColor, setSelectedColor] = useState('#EBF8FF');
  const [buttonText, setButtonText] = useState('See Registry');
  const [successMessage, setSuccessMessage] = useState('');
  const [invitationCreated, setInvitationCreated] = useState(false);
  const [existingInvitationData, setExistingInvitationData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const editorRef = useRef(null);

  // Greeting message edit mode state
  const [isEditingGreeting, setIsEditingGreeting] = useState(false);
  const [originalWelcomeMessage, setOriginalWelcomeMessage] = useState('');

  // SMS state
  const [smsMessage, setSmsMessage] = useState("Hi! I'd like to share my registry with you. Check it out here: [Registry Link]");
  const [smsCta, setSmsCta] = useState("See Registry");
  const [sendingSms, setSendingSms] = useState(false);
  
  // Send to options
  const [emailSendTo, setEmailSendTo] = useState("unnotified");
  const [smsSendTo, setSmsSendTo] = useState("unnotified");

  // Reference for tab content scrolling
  const tabContentRef = useRef(null);

  // Scroll to tab content when tab changes
  useEffect(() => {
    if (tabContentRef.current) {
      const offset = 100; // Scroll a bit above the tab content
      const elementPosition = tabContentRef.current.offsetTop;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const handleVariantChange = (productId, variantIndex) => {
    setVariantMap((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }))
  }

  useEffect(() => {
    if (wishlistFetched.current) return; 
    wishlistFetched.current = true; 
  
    const loadWishlist = async () => {
      try {
        const wishlistProductIds = await fetchWishlist();
        setWishlist(new Set(wishlistProductIds.map(String)));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
  
    loadWishlist();
  }, []);

  const fetchRegistryProducts = async () => {
    try {
      setProductLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/products/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch registry products");

      const data = await response.json();
      setRegistryProducts(data);

      // Transform products to ProductCard format
      const transformed = [];
      const variantMapTemp = {};

      for (const registryProduct of data) {
        try {
          const productInfo = await fetchProductInfo(registryProduct.web_variant_id);
          if (productInfo) {
            const isVirtual = registryProduct.is_virtual;
            const transformedProduct = {
              id: productInfo.id,
              name: isVirtual ? registryProduct.virtual_product_title : productInfo.name,
              slug: productInfo.slug,
              description: productInfo.description || "",
              media: productInfo.media || [],
              pricing: isVirtual
                ? {
                    ...productInfo.pricing,
                    priceRange: {
                      ...productInfo.pricing?.priceRange,
                      start: {
                        ...productInfo.pricing?.priceRange?.start,
                        gross: {
                          ...productInfo.pricing?.priceRange?.start?.gross,
                          amount: isVirtual ? parseFloat(registryProduct.virtual_product_price) : productInfo.pricing?.priceRange?.start?.gross?.amount,
                        },
                      },
                    },
                  }
                : productInfo.pricing,
              variants: productInfo.variants || [],
              variantType: "default",
              status: productInfo.status || "ACTIVE",
              rating: productInfo.rating || 4.5,
              numberOfReviews: productInfo.numberOfReviews || 0,
              sizes: productInfo.sizes || []
            };
            transformed.push(transformedProduct);
            variantMapTemp[transformedProduct.id] = 0;
          }
        } catch (error) {
          console.error("Error fetching product info:", error);
        }
      }

      setTransformedProducts(transformed);
      setVariantMap(variantMapTemp);
      
    } catch (error) {
      console.error("Error fetching registry products:", error);
      toast.error("Could not load registry products");
    } finally {
      setProductLoading(false);
    }
  };

  const fetchRegistry = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch registry");

      const data = await response.json();
      console.log('Registry data received:', data);
      setRegistry(data);
      setGreetingMessage(data.welcome_message || "");
      setOriginalWelcomeMessage(data.welcome_message || "");
      
    } catch (error) {
      console.error("Error fetching registry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      fetchRegistry();
    }
  }, [uuid]);

  useEffect(() => {
    if (uuid && activeTab === "products") {
      fetchRegistryProducts();
    }
  }, [uuid, activeTab]);

  useEffect(() => {
    if (uuid && activeTab === "guests") {
      fetchGuests();
    }
    if (uuid && (activeTab === "share-via-email" || activeTab === "share-via-sms")) {
      fetchGuests();
      fetchExistingInvitation();
    }
  }, [uuid, activeTab]);

  useEffect(() => {
    if (uuid && activeTab === "orders") {
      fetchOrders();
    }
  }, [uuid, activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
    );
    if (!token) return;

    try {
      const payload = {
        title: registry.title,
        description: registry.description || "",
        is_active: registry.is_active,
        is_public: registry.is_public,
        closing_date: registry.closing_date || null,
        bulk_shipment: registry.bulk_shipment,
        welcome_message: greetingMessage,
        shipping_address: {
          address_line_1: registry.shipping_address.address_line_1,
          city: registry.shipping_address.city,
          country: registry.shipping_address.country,
          postal_code: registry.shipping_address.postal_code,
          notes: registry.shipping_address.notes || "",
          phone: registry.shipping_address.phone || "",
        },
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update registry");

      toast.success("Registry updated successfully");
      fetchRegistry();
    } catch (error) {
      console.error("Error updating registry:", error);
      toast.error("Could not update registry");
    }
  };

  const handleChange = (field, value) => {
    setRegistry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setRegistry((prev) => ({
      ...prev,
      shipping_address: {
        ...prev.shipping_address,
        [field]: value,
      },
    }));
  };

  // Guest management functions
  const fetchGuests = async () => {
    try {
      setGuestLoading(true);
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
      setGuestLoading(false);
    }
  };

  // Orders management functions
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/orders/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);
      
      // Fetch product details for all products in orders
      await fetchProductDetails(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProductDetails = async (ordersData) => {
    const productIds = new Set();
    
    // Collect all unique product variant IDs
    ordersData.forEach(order => {
      order.products.forEach(product => {
        productIds.add(product.web_variant_id);
      });
    });

    const productDetailsMap = {};

    // Fetch details for each product
    for (const variantId of productIds) {
      try {
        const query = `
          query GetProductVariant($id: ID!) {
            productVariant(id: $id) {
              id
              name
              product {
                id
                name
                thumbnail {
                  url
                }
                media {
                  url
                }
              }
              pricing {
                price {
                  gross {
                    amount
                    currency
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { id: variantId }
          })
        });

        const result = await response.json();
        
        if (result.data?.productVariant) {
          productDetailsMap[variantId] = result.data.productVariant;
        }
      } catch (error) {
        console.error(`Error fetching product details for ${variantId}:`, error);
      }
    }

    setProductDetails(productDetailsMap);
  };

  // Invitation management functions
  const fetchExistingInvitation = async () => {
    try {
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Existing invitation found:', data);
        setInvitationCreated(true);
        
        // Populate button text from existing invitation
        if (data.email_cta) {
          setButtonText(data.email_cta);
        }

        // Set background color from root level
        if (data.background_color) {
          setSelectedColor(data.background_color);
        }

        // If email_body exists and has blocks, store the data for editor initialization
        if (data.email_body && data.email_body.blocks && Array.isArray(data.email_body.blocks)) {
          // Check for hidden text blocks that might contain button text
          data.email_body.blocks.forEach(block => {
            if (block.type === 'hiddenText' && block.data && block.data.text && block.data.type === 'button_text') {
              setButtonText(block.data.text);
            }
          });

          // Store the existing invitation data for editor initialization
          // Add IDs to blocks that don't have them (required by EditorJS)
          const blocksWithIds = data.email_body.blocks.map((block, index) => ({
            ...block,
            id: block.id || `block_${index}_${Date.now()}`
          }));

          const existingData = {
            time: data.email_body.time || Date.now(),
            blocks: blocksWithIds,
            version: data.email_body.version || "2.31.0-rc.7"
          };

          console.log('Storing existing invitation data:', existingData);
          console.log('Number of blocks:', data.email_body.blocks.length);
          console.log('Blocks with image data:', data.email_body.blocks.filter(b => b.type === 'customImage'));
          console.log('Background color from API:', data.background_color);
          setExistingInvitationData(existingData);
        }
      } else if (response.status === 404) {
        // No invitation exists yet
        console.log('No existing invitation found');
        setInvitationCreated(false);
        setExistingInvitationData(null);
      } else {
        console.error('Error fetching invitation:', response.statusText);
      }
    } catch (error) {
      console.error("Error fetching existing invitation:", error);
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
        toast.error("Failed to add guest: " + (error.detail || res.statusText));
        return;
      }

      const createdGuest = await res.json();
      await fetchGuests();
      setNewGuest({ first_name: "", last_name: "", email: "", phone: "" });
      setGuestSuccessMessage('Guest added successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setGuestSuccessMessage('');
      }, 3000);
    } catch (err) {
      toast.error("Unexpected error: " + err.message);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = sessionStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL +
        "+saleor_auth_module_refresh_token"
    );

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      toast.success("Image updated");
      fetchRegistry();
    } catch (err) {
      console.error(err);
      toast.error("Could not upload image");
    }
  };

  const handleEditGreetingMessage = () => {
    setIsEditingGreeting(true);
    // Focus after state update
    setTimeout(() => {
      if (greetingMessageRef.current) {
        greetingMessageRef.current.focus();
        greetingMessageRef.current.select();
      }
    }, 0);
  };

  const handleFinishEditingGreeting = async () => {
    setIsEditingGreeting(false);
    await saveWelcomeMessage();
  };

  const handleGreetingKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinishEditingGreeting();
    }
  };

  const saveWelcomeMessage = async () => {
    // Check if message has actually changed (with trimming)
    const currentMessage = greetingMessage.trim();
    const originalMessage = originalWelcomeMessage.trim();
    
    if (currentMessage === originalMessage) {
      // No change detected, no need to save
      return;
    }

    const token = sessionStorage.getItem(
      process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
    );
    if (!token) return;

    try {
      const payload = {
        welcome_message: greetingMessage,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update welcome message");

      toast.success("Welcome message updated");
      setOriginalWelcomeMessage(greetingMessage);
    } catch (error) {
      console.error("Error updating welcome message:", error);
      toast.error("Could not update welcome message");
    }
  };

  // Unified invitation management function
  const handleSendInvitation = async (notificationType, sendNotifications = true) => {
    if (!editorRef.current && notificationType === 'email') {
      console.log('EditorRef is not initialized for email');
      return;
    }
    
    console.log(`${sendNotifications ? 'Sending' : 'Creating/Updating'} invitation via ${notificationType}...`);
    setSending(true);
    setSendingSms(true);

    try {
      let invitationData = {};
      
      // For email invitations, get content from editor
      if (notificationType === 'email') {
        const output = await editorRef.current.save();
        invitationData = {
          email_cta: buttonText || "Click to join",
          email_body: {
            time: output.time || Date.now(),
            blocks: output.blocks,
            version: output.version || "2.0.0",
            background_color: selectedColor
          }
        };
      }
      
      // For SMS invitations, use the SMS message and CTA
      if (notificationType === 'sms') {
        // For sending, check if guests have phone numbers
        if (sendNotifications) {
          const guestsWithPhones = guests.filter(guest => guest.phone && guest.phone.trim());
          
          if (guestsWithPhones.length === 0) {
            alert('No guests have phone numbers. Please add phone numbers to your guests first.');
            return;
          }
        }
        
        invitationData = {
          sms_body: smsMessage,
          sms_cta: smsCta || "See registry"
        };
      }
      
      const token = sessionStorage.getItem(
        process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token"
      );
      
      if (!token) {
        alert('Please log in to manage invitations');
        return;
      }

      // Create/update invitation first
      const requestBody = {
        ...invitationData
      };

      console.log('=== CREATING/UPDATING INVITATION ===');
      console.log('Method:', invitationCreated ? 'PATCH' : 'POST');
      console.log('URL:', `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/`);
      console.log('Request Body (Full JSON):', JSON.stringify(requestBody, null, 2));
      console.log('Notification type:', notificationType);
      console.log('Will send notifications:', sendNotifications);
      console.log('=====================================');

      // Create/update invitation
      const method = invitationCreated ? "PATCH" : "POST";
      const res = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/`, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Invitation response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Invitation error response:', errorData);
        throw new Error(errorData.detail || `Failed to ${invitationCreated ? 'update' : 'create'} invitation`);
      }

      const invitationResult = await res.json();
      console.log(`Invitation ${invitationCreated ? 'updated' : 'created'} successfully:`, invitationResult);
      setInvitationCreated(true);

      // If we should send notifications, do so
      if (sendNotifications) {
        const sendToValue = notificationType === 'email' ? emailSendTo : smsSendTo;
        const notificationBody = {
          email_notification: notificationType === 'email',
          sms_notification: notificationType === 'sms',
          send_to: sendToValue
        };

        console.log('=== SENDING NOTIFICATIONS ===');
        console.log('Method: POST');
        console.log('URL:', `${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/notifications/`);
        console.log('Notification Body:', JSON.stringify(notificationBody, null, 2));
        console.log('==============================');

        const notificationRes = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL}/api/registries/${uuid}/invitation/notifications/`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(notificationBody)
        });

        console.log('Notification response status:', notificationRes.status);

        if (!notificationRes.ok) {
          const errorData = await notificationRes.json();
          console.log('Notification error response:', errorData);
          throw new Error(errorData.detail || `Failed to send ${notificationType} notifications`);
        }

        const notificationResult = await notificationRes.json();
        console.log(`${notificationType.toUpperCase()} notifications sent successfully:`, notificationResult);
        
        let guestsCount;
        let recipientText;
        
        if (sendToValue === "me") {
          recipientText = "yourself (test)";
        } else if (sendToValue === "unnotified") {
          if (notificationType === 'sms') {
            guestsCount = guests.filter(guest => !guest.sms_notified && guest.phone && guest.phone.trim()).length;
          } else {
            guestsCount = guests.filter(guest => !guest.email_notified && guest.email).length;
          }
          recipientText = `${guestsCount} unnotified guests`;
        } else { // "all"
          if (notificationType === 'sms') {
            guestsCount = guests.filter(guest => guest.phone && guest.phone.trim()).length;
          } else {
            guestsCount = guests.filter(guest => guest.email).length;
          }
          recipientText = `${guestsCount} guests`;
        }
        
        setSuccessMessage(`${notificationType.toUpperCase()} invitations sent successfully to ${recipientText}!`);
      } else {
        // Just created/updated, no notifications sent
        setSuccessMessage(`${notificationType.toUpperCase()} invitation ${invitationCreated ? 'updated' : 'created'} successfully!`);
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      console.error(`Error ${sendNotifications ? 'sending' : 'creating/updating'} ${notificationType} invitation:`, err);
      alert(`Failed to ${sendNotifications ? 'send' : 'create/update'} ${notificationType} invitation: ` + err.message);
    } finally {
      setSending(false);
      setSendingSms(false);
    }
  };

  // Invitation template functions
  const getTemplates = () => ({
    template1: {
      blocks: [
        {
          id: "template1_image",
          type: "customImage",
          data: {
            url: "https://grnds-registry-sandbox.s3.amazonaws.com/media/registries/45c/45c8c37d-33d6-4fe5-95a6-bbf34a540102/wedding-invitation-2.png"
          }
        },
        {
          id: "template1_header",
          type: "header",
          data: {
            text: "Welcome to Our Registry",
            level: 2,
            alignment: "center"
          }
        },
        {
          id: "template1_paragraph",
          type: "paragraph",
          data: {
            text: "We're excited to share this special moment with you. Your presence in our lives means the world to us, and we can't wait to celebrate together. Thank you for being part of our journey and for all the love and support you've shown us along the way.",
            alignment: "center"
          }
        },
        {
          id: "template1_hidden",
          type: "hiddenText",
          data: {
            text: buttonText,
            type: "button_text"
          }
        }
      ],
      version: "2.31.0-rc.7"
    },
    template2: {
      blocks: [
        {
          id: "template2_image",
          type: "customImage",
          data: {
            url: "https://grnds-registry-sandbox.s3.amazonaws.com/media/registries/45c/45c8c37d-33d6-4fe5-95a6-bbf34a540102/baby-shower.png"
          }
        },
        {
          id: "template2_header",
          type: "header",
          data: {
            text: "Join Us in Celebration",
            level: 2,
            alignment: "center"
          }
        },
        {
          id: "template2_paragraph",
          type: "paragraph",
          data: {
            text: "We would be honored to have you join us for this special occasion. As we embark on this new chapter, your presence would make our celebration complete. We look forward to creating beautiful memories together and sharing in the joy of this momentous day.",
            alignment: "center"
          }
        },
        {
          id: "template2_hidden",
          type: "hiddenText",
          data: {
            text: buttonText,
            type: "button_text"
          }
        }
      ],
      version: "2.31.0-rc.7"
    }
  });

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

      // Set the image URL from the template
      const imageBlock = templateData.blocks.find(block => block.type === 'customImage');
      if (imageBlock) {
        setImageUrl(imageBlock.data.url);
      }

      try {
        // Destroy the current instance
        await editorRef.current.destroy();
        
        // Determine if image tool should be available
        const showImageTool = shouldShowImageTool(templateData.blocks);

        const tools = {
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
          customButton: CustomButtonTool,
          hiddenText: HiddenTextBlock
        };

        // Only add image tool if no image exists
        if (showImageTool) {
          tools.customImage = {
            class: CustomImageTool,
            config: {
              uuid: uuid,
              meta: templateData.meta
            }
          };
        }
        
        // Create a new instance with the template data
        editorRef.current = new EditorJS({
          holder: "editorjs",
          autofocus: true,
          data: templateData,
          tools: tools
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
    
    // Update the editor background color immediately
    const editorElement = document.getElementById("editorjs");
    if (editorElement) {
      editorElement.style.backgroundColor = color;
    }

    if (editorRef.current) {
      try {
        // Check if the editor is ready first
        await editorRef.current.isReady;
        
        // Save current content
        const currentData = await editorRef.current.save();
        
        // Update data (no meta needed)
        const updatedData = {
          ...currentData,
          time: Date.now()
        };

        // Destroy and recreate with updated color
        await editorRef.current.destroy();
        editorRef.current = null;
        
        setTimeout(() => {
          initializeEditorWithData(updatedData);
        }, 100);
      } catch (error) {
        console.error('Error updating color:', error);
        // Fallback: just update the background color
        if (editorElement) {
          editorElement.style.backgroundColor = color;
        }
      }
    }
  };

  // Helper function to check if image tool should be available
  const shouldShowImageTool = (blocks) => {
    // Check if any block is a customImage (with or without data)
    const hasImageBlock = blocks.some(block => block.type === 'customImage');
    console.log('Checking shouldShowImageTool:', { blocks, hasImageBlock });
    return !hasImageBlock;
  };

  // Helper function to initialize editor
  const initializeEditor = () => {
    if (document.getElementById("editorjs") && !editorRef.current) {
      // Use existing invitation data if available, otherwise use the default template's blocks
      let initialData = existingInvitationData || {
        time: Date.now(),
        blocks: getTemplates().template1.blocks,
        version: "2.31.0-rc.7"
      };
      // Remove hiddenText blocks if present
      initialData = {
        ...initialData,
        blocks: initialData.blocks.filter(block => block.type !== 'hiddenText')
      };

      console.log('Initializing editor with data:', initialData);
      console.log('Using existing invitation data:', !!existingInvitationData);
      console.log('Blocks in initial data:', initialData.blocks);

      // Determine if image tool should be available
      const showImageTool = shouldShowImageTool(initialData.blocks);
      console.log('Should show image tool:', showImageTool);
      console.log('Image blocks found:', initialData.blocks.filter(b => b.type === 'customImage'));

      const tools = {
        header: Header,
        paragraph: {
          inlineToolbar: true,
          config: {
            defaultAlignment: 'center',
            placeholder: 'Enter text here',
            preserveBlank: true
          }
        }
      };

      // Only add image tool if no image exists
      if (showImageTool) {
        tools.customImage = {
          class: CustomImageTool,
          config: {
            uuid: uuid
          }
        };
      }

      editorRef.current = new EditorJS({
        holder: "editorjs",
        autofocus: false,
        placeholder: "Write your invitation...",
        data: initialData,
        tools: tools,
        onReady: () => {
          console.log('Editor initialized successfully');
          const editorElement = document.getElementById("editorjs");
          if (editorElement) {
            editorElement.style.backgroundColor = selectedColor;
          }
        },
        onChange: () => {
          // When content changes, check if we need to update tool availability
          if (editorRef.current) {
            editorRef.current.save().then((outputData) => {
              const hasImage = outputData.blocks.some(block => block.type === 'customImage');
              // We could potentially refresh the toolbar here if needed
            });
          }
        }
      });
    }
  };

  // Helper function to initialize with template
  const initializeEditorWithTemplate = (templateId) => {
    const templates = getTemplates();
    let templateData = {
      time: Date.now(),
      blocks: templates[templateId].blocks,
      version: "2.31.0-rc.7"
    };
    // Remove hiddenText blocks if present
    templateData = {
      ...templateData,
      blocks: templateData.blocks.filter(block => block.type !== 'hiddenText')
    };

    if (document.getElementById("editorjs") && !editorRef.current) {
      // Determine if image tool should be available
      const showImageTool = shouldShowImageTool(templateData.blocks);

      const tools = {
        header: {
          class: Header,
          config: {
            defaultAlignment: 'center',
            levels: [1, 2, 3],
            placeholder: 'Enter a header'
          }
        },
        paragraph: {
          inlineToolbar: true,
          config: {
            defaultAlignment: 'center',
            placeholder: 'Enter text here',
            preserveBlank: true
          }
        }
      };

      // Only add image tool if no image exists
      if (showImageTool) {
        tools.customImage = {
          class: CustomImageTool,
          config: {
            uuid: uuid
          }
        };
      }

      editorRef.current = new EditorJS({
        holder: "editorjs",
        autofocus: false,
        data: templateData,
        tools: tools,
        onReady: () => {
          console.log('Editor initialized with template:', templateId);
          const editorElement = document.getElementById("editorjs");
          if (editorElement) {
            editorElement.style.backgroundColor = selectedColor;
          }
        }
      });
    }
  };

  // Helper function to initialize with specific data
  const initializeEditorWithData = (data) => {
    let filteredData = {
      ...data,
      blocks: data.blocks.filter(block => block.type !== 'hiddenText')
    };

    if (document.getElementById("editorjs") && !editorRef.current) {
      // Determine if image tool should be available
      const showImageTool = shouldShowImageTool(filteredData.blocks);

      const tools = {
        header: {
          class: Header,
          config: {
            defaultAlignment: 'center',
            levels: [1, 2, 3],
            placeholder: 'Enter a header'
          }
        },
        paragraph: {
          inlineToolbar: true,
          config: {
            defaultAlignment: 'center',
            placeholder: 'Enter text here',
            preserveBlank: true
          }
        }
      };

      // Only add image tool if no image exists
      if (showImageTool) {
        tools.customImage = {
          class: CustomImageTool,
          config: {
            uuid: uuid
          }
        };
      }

      editorRef.current = new EditorJS({
        holder: "editorjs",
        autofocus: false,
        data: filteredData,
        tools: tools,
        onReady: () => {
          console.log('Editor initialized with custom data');
          const editorElement = document.getElementById("editorjs");
          if (editorElement) {
            editorElement.style.backgroundColor = selectedColor;
          }
        }
      });
    }
  };



  // Initialize EditorJS when the share-via-email tab is active
  useEffect(() => {
    if (typeof window !== "undefined" && activeTab === "share-via-email") {
      const timeout = setTimeout(() => {
        // Clean up any existing editor first
        if (editorRef.current) {
          editorRef.current.isReady.then(() => {
            return editorRef.current.destroy();
          }).then(() => {
            editorRef.current = null;
            initializeEditor();
          }).catch((error) => {
            console.error('Error destroying existing editor:', error);
            editorRef.current = null;
            initializeEditor();
          });
        } else {
          initializeEditor();
        }
      }, 300);
  
      return () => {
        clearTimeout(timeout);
        // Cleanup on unmount or tab change
        if (editorRef.current && activeTab !== "share-via-email") {
          editorRef.current.isReady.then(() => {
            return editorRef.current.destroy();
          }).catch((error) => {
            console.error('Error destroying editor on cleanup:', error);
          }).finally(() => {
            editorRef.current = null;
          });
        }
      };
    }
  }, [activeTab, selectedColor, buttonText]);

  // Separate useEffect to handle existing invitation data loading
  useEffect(() => {
    if (existingInvitationData && editorRef.current && activeTab === "share-via-email") {
      console.log('Loading existing invitation data into editor:', existingInvitationData);
      
      // Reinitialize editor with existing data
      editorRef.current.isReady.then(() => {
        return editorRef.current.destroy();
      }).then(() => {
        editorRef.current = null;
        
        // Initialize with existing data
        setTimeout(() => {
          initializeEditorWithData(existingInvitationData);
        }, 100);
      }).catch((error) => {
        console.error('Error reinitializing editor with existing data:', error);
        editorRef.current = null;
        setTimeout(() => {
          initializeEditorWithData(existingInvitationData);
        }, 200);
      });
    }
  }, [existingInvitationData]);

  useEffect(() => {
    const handleImageUpload = (event) => {
      setImageUrl(event.detail.imageUrl);
    };

    window.addEventListener('imageUploaded', handleImageUpload);
    return () => {
      window.removeEventListener('imageUploaded', handleImageUpload);
    };
  }, []);

  if (loading) {
    return <RegistryPageSkeleton />;
  }

  if (!registry) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Registry not found.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Registry
                </label>
                <input
                  type="text"
                  value={registry.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter registry title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of Registry
                </label>
                <input
                  type="text"
                  value={registry.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter registry name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Event
                </label>
                <input
                  type="date"
                  value={
                    registry.closing_date
                      ? new Date(registry.closing_date).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => {
                    const isoString = new Date(e.target.value + "T00:00:00").toISOString();
                    handleChange("closing_date", isoString);
                  }}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Day of the List
                </label>
                <input
                  type="date"
                  value={
                    registry.closing_date
                      ? new Date(registry.closing_date).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => {
                    const isoString = new Date(e.target.value + "T00:00:00").toISOString();
                    handleChange("closing_date", isoString);
                  }}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name of the Registrant
                </label>
                <input
                  type="text"
                  value={registry.creator || 'Not specified'}
                  readOnly
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="text"
                  value={guests.length || 0}
                  readOnly
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="registry-active"
                  checked={registry.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5"
                />
                <label htmlFor="registry-active" className="text-sm text-gray-700 leading-5">
                  Registry Active
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="bulk-shipment"
                  checked={registry.bulk_shipment}
                  onChange={(e) => handleChange("bulk_shipment", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5"
                />
                <label htmlFor="bulk-shipment" className="text-sm text-gray-700 leading-5">
                  Bulk Shipment
                </label>
              </div>
            </div>
          </div>
        );

      case "products":
        // Calculate real statistics from registry data
        const calculateStats = () => {
          const totalProducts = registry?.total_products || 0;
          const totalPurchasedItems = registry?.total_purchased_items || 0;
          const totalGroupGiftingBalance = registry?.total_group_gifting_balance || 0;
          const totalRemainingGroupGiftingBalance = registry?.total_remaining_group_gifting_balance || 0;
          
          // Calculate purchased products percentage
          const purchasedPercentage = totalProducts > 0 ? Math.round((totalPurchasedItems / totalProducts) * 100) : 0;
          
          // Calculate group gifting progress
          const totalGroupGiftingNeeded = totalGroupGiftingBalance + totalRemainingGroupGiftingBalance;
          const groupGiftingPercentage = totalGroupGiftingNeeded > 0 ? Math.round((totalGroupGiftingBalance / totalGroupGiftingNeeded) * 100) : 0;

          return {
            purchasedProducts: {
              purchased: totalPurchasedItems,
              total: totalProducts,
              percentage: purchasedPercentage
            },
            groupGifting: {
              funded: totalGroupGiftingBalance,
              remaining: totalRemainingGroupGiftingBalance,
              total: totalGroupGiftingNeeded,
              percentage: groupGiftingPercentage
            }
          };
        };

        const stats = calculateStats();

        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Registry Statistics */}
            <div className="mb-6 sm:mb-8">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900">Η λίστα μου</h3>
              </div>
              
              {/* Stats Charts */}
              <div className="text-center">
                <div className="flex justify-center items-start gap-8 sm:gap-16 flex-wrap">
                  <div className="flex flex-col items-center min-w-[120px]">
                    <CircularProgress 
                      percentage={stats.purchasedProducts.percentage}
                      value={`${stats.purchasedProducts.purchased}/${stats.purchasedProducts.total}`}
                      label="Products Purchased"
                      color="#10B981"
                    />
                  </div>
                  {stats.groupGifting.total > 0 && (
                    <div className="flex flex-col items-center min-w-[120px]">
                      <CircularProgress 
                        percentage={stats.groupGifting.percentage}
                        value={`€${stats.groupGifting.funded.toFixed(2)}`}
                        label={`Group Gifts Funded`}
                        color="#3B82F6"
                      />
                      <p className="text-xs text-gray-500 mt-1 max-w-[140px]">
                        €{stats.groupGifting.remaining.toFixed(2)} remaining
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Section with Filters */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
              <div className="lg:w-1/3 xl:w-1/4 lg:pr-4">
                <SidebarFilters />
              </div>
              <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mx-4"></div>
              <div className="flex-1">
                <div className="flex justify-end mb-4 sm:mb-6">
                  <select
                    className="border border-gray-300 px-3 py-2 text-xs sm:text-sm text-slate-800 w-full sm:w-auto"
                    onChange={(e) => {
                      const value = e.target.value;
                      const sorted = [...transformedProducts].sort((a, b) => {
                        if (value === "price_asc") {
                          return a.pricing.priceRange.start.gross.amount - b.pricing.priceRange.start.gross.amount;
                        } else if (value === "price_desc") {
                          return b.pricing.priceRange.start.gross.amount - a.pricing.priceRange.start.gross.amount;
                        } else {
                          return 0;
                        }
                      });
                      setTransformedProducts(sorted);
                    }}
                  >
                    <option value="">Ταξινόμηση</option>
                    <option value="price_asc">Τιμή: Χαμηλή προς Υψηλή</option>
                    <option value="price_desc">Τιμή: Υψηλή προς Χαμηλή</option>
                  </select>
                </div>

                {productLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="relative w-12 h-12">
                      <div className="w-12 h-12 border-4 border-gray-200 rounded-none"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-none animate-spin"></div>
                    </div>
                  </div>
                ) : transformedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-10">
                    {transformedProducts.map((item, index) => (
                      <ProductCard 
                        key={item.id}
                        data={item}
                        isLiked={wishlist.has(String(item.id))}
                        variantActive={variantMap[item.id] || 0}
                        onVariantChange={(index) => handleVariantChange(item.id, index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm sm:text-base">Δεν υπάρχουν προϊόντα σε αυτή τη λίστα ακόμα.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={registry.shipping_address?.address_line_1 || ""}
                onChange={(e) => handleAddressChange("address_line_1", e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={registry.shipping_address?.city || ""}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={registry.shipping_address?.postal_code || ""}
                  onChange={(e) => handleAddressChange("postal_code", e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter postal code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={registry.shipping_address?.country || ""}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a country</option>
                  <option value="GR">Greece</option>
                  <option value="CY">Cyprus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  value={registry.shipping_address?.phone || ""}
                  onChange={(value) => handleAddressChange("phone", value || "")}
                  placeholder="Enter phone number"
                  defaultCountry="GR"
                />
              </div>
            </div>
          </div>
        );

      case "guests":
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Add Guest Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Add a New Guest</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newGuest.first_name}
                  onChange={(e) => setNewGuest({ ...newGuest, first_name: e.target.value })}
                  placeholder="First name"
                  className="border border-gray-300 px-4 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newGuest.last_name}
                  onChange={(e) => setNewGuest({ ...newGuest, last_name: e.target.value })}
                  placeholder="Last name"
                  className="border border-gray-300 px-4 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  placeholder="Guest email"
                  className="border border-gray-300 px-4 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <PhoneInput
                  value={newGuest.phone}
                  onChange={(value) => setNewGuest({ ...newGuest, phone: value || "" })}
                  placeholder="Guest phone"
                  defaultCountry="GR"
                />
              </div>
              <button
                onClick={handleAddGuest}
                type="button"
                className="w-full sm:w-auto px-6 py-3 sm:py-2 text-white hover:opacity-90 transition-colors text-sm sm:text-base"
                style={{ backgroundColor: '#222222' }}
              >
                Add Guest
              </button>
            </div>

            {/* Guest List Overview */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-6 border-t border-gray-200 gap-4">
              <h3 className="text-lg font-medium text-gray-900">Guest List</h3>
              <button
                onClick={() => setShowGuestsModal(true)}
                type="button"
                className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 hover:opacity-90 transition-colors text-sm sm:text-base"
                style={{ backgroundColor: '#61C5C3', color: '#222222' }}
              >
                <span>View All Guests</span>
                <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-none">
                  {guests.length}
                </span>
              </button>
            </div>

            {/* Guest Preview */}
            {guestLoading ? (
              <div className="text-center py-8">
                <p className="text-sm sm:text-base">Loading guests...</p>
              </div>
            ) : guests.length > 0 ? (
              <div className="grid gap-4 max-h-60 overflow-y-auto">
                {guests.slice(0, 3).map((guest) => (
                  <div
                    key={guest.id}
                    className="border rounded-none p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            {guest.first_name} {guest.last_name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {/* Email notification status */}
                            {guest.email && (
                              <div className="flex items-center">
                                <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {guest.email_notified ? (
                                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                            )}
                            {/* SMS notification status */}
                            {guest.phone && (
                              <div className="flex items-center">
                                <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {guest.sms_notified ? (
                                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {guest.email && (
                          <p className="text-xs sm:text-sm text-gray-600">{guest.email}</p>
                        )}
                        {guest.phone && (
                          <p className="text-xs sm:text-sm text-gray-600">{guest.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {guests.length > 3 && (
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    And {guests.length - 3} more guests...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base">No guests added yet.</p>
                <p className="text-xs sm:text-sm mt-2">Add your first guest using the form above.</p>
              </div>
            )}

            {/* Success Message */}
            {guestSuccessMessage && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-none flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">{guestSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setGuestSuccessMessage('')}
                  className="text-green-600 hover:text-green-800 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );

      case "share-via-email":
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Guest List Summary */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Send Email Invitations</h3>
                <p className="text-sm text-gray-600">
                  Create and send email invitations to your guest list.
                </p>
              </div>
              <button
                onClick={() => setShowGuestsModal(true)}
                type="button"
                className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 hover:opacity-90 transition-colors text-sm sm:text-base"
                style={{ backgroundColor: '#61C5C3', color: '#222222' }}
              >
                <span>View All Guests</span>
                <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-none">
                  {guests.length}
                </span>
              </button>
            </div>

            {/* Invitation Section */}
            <div className="space-y-4" id="invitation-section">
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleTemplateChange('template1')}
                    className={`p-4 border ${
                      selectedTemplate === 'template1' 
                        ? 'border-[rgb(6,59,103)] bg-[rgba(6,59,103,0.1)]' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src="https://grnds-registry-sandbox.s3.amazonaws.com/media/registries/45c/45c8c37d-33d6-4fe5-95a6-bbf34a540102/wedding-invitation-2.png"
                      alt="Template 1"
                      className="w-full h-48 sm:h-32 object-cover mb-2"
                    />
                    <span className="text-sm font-medium">Classic Registry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateChange('template2')}
                    className={`p-4 border ${
                      selectedTemplate === 'template2' 
                        ? 'border-[rgb(6,59,103)] bg-[rgba(6,59,103,0.1)]' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src="https://grnds-registry-sandbox.s3.amazonaws.com/media/registries/45c/45c8c37d-33d6-4fe5-95a6-bbf34a540102/baby-shower.png"
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
                <div className="flex flex-col md:flex-row md:items-center gap-8 w-full">
                  {/* Color palette carousel */}
                  <div className="md:w-[70%] w-full flex flex-col justify-center">
                    <label className="text-sm font-medium text-gray-700 mb-2 block md:hidden">
                      Background Color
                    </label>
                    <div className="relative">
                      <div className="flex items-center space-x-2 w-full pr-4 overflow-x-auto scrollbar-hide">
                        <button
                          type="button"
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
                          className="flex flex-row space-x-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {colorPalette.map((color) => (
                            <button
                              key={color.value}
                              type="button"
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
                          type="button"
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
                  </div>
                  {/* Custom color input */}
                  <div className="md:w-[30%] min-w-[220px] w-full flex flex-row items-center justify-start gap-3">
                    <label className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">
                      Custom Color
                    </label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-12 w-12 border-2 border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-none text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
                      maxLength={7}
                    />
                    <div 
                      className="w-12 h-12 rounded border-2 border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: selectedColor }}
                      title="Current color preview"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 md:ml-[70%]">
                  Use the color picker or enter a hex code (e.g., #FF5733)
                </p>
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
                    type="button"
                    onClick={() => setButtonText('See Registry')}
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
                    border: 'none',
                    width: '100%'
                  }}
                />
                <style jsx global>{`
                  .ce-header, .ce-paragraph {
                    text-align: center !important;
                  }
                  .ce-toolbar__plus, .ce-toolbar__settings-btn {
                    color: #063B67 !important;
                  }
                  .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
                    background-color: rgba(6, 59, 103, 0.1) !important;
                  }
                  .ce-block__content {
                    max-width: 100% !important;
                    margin: 0 auto !important;
                  }
                  .ce-toolbar__content {
                    max-width: 100% !important;
                    margin: 0 auto !important;
                  }
                  .ce-block {
                    max-width: 100% !important;
                    margin: 0 auto !important;
                  }
                  .ce-block__content {
                    text-align: center !important;
                  }
                  .ce-paragraph {
                    text-align: center !important;
                  }
                  .ce-header {
                    text-align: center !important;
                  }
                  .codex-editor {
                    width: 100% !important;
                  }
                  .codex-editor__redactor {
                    padding-bottom: 100px !important;
                  }
                  .ce-block--selected .ce-block__content {
                    background: rgba(6, 59, 103, 0.1) !important;
                  }
                  .ce-toolbar__actions {
                    right: 0 !important;
                  }
                  .ce-toolbar__plus {
                    left: 0 !important;
                  }
                  .ce-toolbar__settings-btn {
                    right: 0 !important;
                  }
                `}</style>
              </div>

              {/* Recipient Selection for Email */}
              {invitationCreated && (
                <div className="space-y-3 mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Send invitations to:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="emailSendTo"
                        value="unnotified"
                        checked={emailSendTo === "unnotified"}
                        onChange={(e) => setEmailSendTo(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Only unnotified guests ({guests.filter(g => !g.email_notified && g.email).length} guests)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="emailSendTo"
                        value="all"
                        checked={emailSendTo === "all"}
                        onChange={(e) => setEmailSendTo(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">All guests with email ({guests.filter(g => g.email).length} guests)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="emailSendTo"
                        value="me"
                        checked={emailSendTo === "me"}
                        onChange={(e) => setEmailSendTo(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Test - Send to myself only</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {!invitationCreated ? (
                  <button
                    onClick={() => handleSendInvitation('email', false)}
                    disabled={sending}
                    type="button"
                    className="px-6 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#063B67' }}
                  >
                    {sending ? "Creating..." : "Create Email Invitation"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSendInvitation('email', false)}
                      disabled={sending}
                      type="button"
                      className="bg-gray-600 text-white px-6 py-2 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? "Updating..." : "Update Email Invitation"}
                    </button>
                    <button
                      onClick={() => handleSendInvitation('email', true)}
                      disabled={sending || (emailSendTo !== "me" && guests.length === 0)}
                      type="button"
                      className="px-6 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#063B67' }}
                    >
                      {sending ? "Sending..." : `Send Email Invitations`}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-none flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">{successMessage}</span>
                </div>
                <button
                  onClick={() => setSuccessMessage('')}
                  className="text-green-600 hover:text-green-800 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );

            case "share-via-sms":
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Guest List Summary */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Send SMS Invitations</h3>
                <p className="text-sm text-gray-600">
                  Send registry invitations to your guest list via SMS message.
                </p>
              </div>
              <button
                onClick={() => setShowGuestsModal(true)}
                type="button"
                className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 hover:opacity-90 transition-colors text-sm sm:text-base"
                style={{ backgroundColor: '#61C5C3', color: '#222222' }}
              >
                <span>View All Guests</span>
                <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-none">
                  {guests.length}
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Message
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) {
                      setSmsMessage(e.target.value);
                    }
                  }}
                  placeholder="Hi! I'd like to share my registry with you. Check it out here: [Registry Link]"
                  className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Customize your SMS message. The registry link will be automatically included.
                  </p>
                  <span className={`text-xs ${smsMessage.length > 90 ? 'text-red-500' : 'text-gray-400'}`}>
                    {smsMessage.length}/100
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  value={smsCta}
                  onChange={(e) => {
                    if (e.target.value.length <= 15) {
                      setSmsCta(e.target.value);
                    }
                  }}
                  placeholder="See Registry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={15}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Text for the action button in the SMS invitation.
                  </p>
                  <span className={`text-xs ${smsCta.length > 12 ? 'text-red-500' : 'text-gray-400'}`}>
                    {smsCta.length}/15
                  </span>
                </div>
              </div>

              {/* Recipient Selection for SMS */}
              {invitationCreated && (
                <div className="space-y-3 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Send SMS invitations to:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smsSendTo"
                        value="unnotified"
                        checked={smsSendTo === "unnotified"}
                        onChange={(e) => setSmsSendTo(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Only unnotified guests ({guests.filter(g => !g.sms_notified && g.phone).length} guests)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smsSendTo"
                        value="all"
                        checked={smsSendTo === "all"}
                        onChange={(e) => setSmsSendTo(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">All guests with phone ({guests.filter(g => g.phone).length} guests)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smsSendTo"
                        value="me"
                        checked={smsSendTo === "me"}
                        onChange={(e) => setSmsSendTo(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Test - Send to myself only</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {!invitationCreated ? (
                  <button
                    onClick={() => handleSendInvitation('sms', false)}
                    disabled={sendingSms || !smsMessage.trim() || !smsCta.trim()}
                    type="button"
                    className="px-6 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#063B67' }}
                  >
                    {sendingSms ? "Creating..." : "Create SMS Invitation"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSendInvitation('sms', false)}
                      disabled={sendingSms || !smsMessage.trim() || !smsCta.trim()}
                      type="button"
                      className="bg-gray-600 text-white px-6 py-2 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingSms ? "Updating..." : "Update SMS Invitation"}
                    </button>
                    <button
                      onClick={() => handleSendInvitation('sms', true)}
                      disabled={sendingSms || !smsMessage.trim() || !smsCta.trim() || (smsSendTo !== "me" && guests.length === 0)}
                      type="button"
                      className="px-6 py-2 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#063B67' }}
                    >
                      {sendingSms ? 'Sending...' : `Send SMS Invitations`}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Guest List Overview with SMS Status */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Guest List SMS Status</h4>

              {guestLoading ? (
                <div className="text-center py-8">
                  <p className="text-sm sm:text-base">Loading guests...</p>
                </div>
              ) : guests.length > 0 ? (
                <div className="grid gap-4 max-h-60 overflow-y-auto">
                  {guests.slice(0, 3).map((guest) => (
                    <div
                      key={guest.id}
                      className="border rounded-none p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                              {guest.first_name} {guest.last_name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {/* Email notification status */}
                              {guest.email && (
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {guest.email_notified ? (
                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                              {/* SMS notification status */}
                              {guest.phone && (
                                <div className="flex items-center">
                                  <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {guest.sms_notified ? (
                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {guest.email && (
                            <p className="text-xs sm:text-sm text-gray-600">{guest.email}</p>
                          )}
                          {guest.phone && (
                            <p className="text-xs sm:text-sm text-gray-600">{guest.phone}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {guest.phone ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium ${
                              guest.sms_notified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {guest.sms_notified ? 'SMS Sent' : 'SMS Ready'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-red-100 text-red-800">
                              No Phone
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {guests.length > 3 && (
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                      And {guests.length - 3} more guests...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm sm:text-base">No guests added yet.</p>
                  <p className="text-xs sm:text-sm mt-2">Add guests in the "Guests" tab first.</p>
                </div>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-none flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">{successMessage}</span>
                </div>
                <button
                  onClick={() => setSuccessMessage('')}
                  className="text-green-600 hover:text-green-800 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-lg font-medium text-gray-900">Registry Orders</h3>
            
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Orders from your registry will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => {
                  console.log('Order customer object:', order.customer);
                  return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-none overflow-hidden"
                  >
                                         <div className="p-6">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <h4 className="text-lg font-medium text-gray-900">
                             Order #{index + 1}
                           </h4>
                           {order.customer_note && (
                             <p className="text-sm text-gray-600 mt-1">
                               Note: {order.customer_note}
                             </p>
                           )}
                         </div>
                       </div>

                       {/* Buyer Information */}
                       {(order.customer.first_name || order.customer.last_name || order.customer.email || order.customer.phone) && (
                         <div className="mb-6 p-4 bg-blue-50 rounded-none border-l-4 border-blue-400">
                           <h5 className="font-medium text-blue-900 mb-2">Gift Purchased By:</h5>
                           <div className="space-y-1 text-sm text-blue-800">
                             {(order.customer.first_name || order.customer.last_name) && (
                               <p className="flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                 </svg>
                                 <span className="font-medium">
                                   {[order.customer.first_name, order.customer.last_name].filter(Boolean).join(' ')}
                                 </span>
                               </p>
                             )}
                             {order.customer.email && (
                               <p className="flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                 </svg>
                                 {order.customer.email}
                               </p>
                             )}
                             {order.customer.phone && (
                               <p className="flex items-center">
                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.5 11.5s-.5 2.5 2 5 5 2 5 2l2.103-3.724a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                 </svg>
                                 {order.customer.phone}
                               </p>
                             )}
                           </div>
                         </div>
                       )}

                      {/* Order Products */}
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900">Products:</h5>
                        {order.products.map((product, productIndex) => {
                          const productDetail = productDetails[product.web_variant_id];
                          
                          return (
                            <div
                              key={productIndex}
                              className="flex items-start p-4 bg-gray-50 rounded-none"
                            >
                              {/* Product Image */}
                              <div className="flex-shrink-0 w-16 h-16 mr-4">
                                {productDetail?.product?.thumbnail?.url ? (
                                  <img
                                    src={productDetail.product.thumbnail.url}
                                    alt={productDetail.product.name}
                                    className="w-16 h-16 object-cover rounded-none"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-none flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h6 className="text-sm font-medium text-gray-900">
                                      {productDetail?.product?.name || 'Loading product...'}
                                    </h6>
                                    {productDetail?.name && productDetail.name !== productDetail.product?.name && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        Variant: {productDetail.name}
                                      </p>
                                    )}
                                    {productDetail?.pricing?.price?.gross && (
                                      <p className="text-sm font-medium text-gray-900 mt-1">
                                        {productDetail.pricing.price.gross.currency} {productDetail.pricing.price.gross.amount}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {/* Badges */}
                                  <div className="flex flex-col items-end space-y-1 ml-4">
                                    {product.is_group_gifting && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-blue-100 text-blue-800">
                                        Group Gift
                                      </span>
                                    )}
                                    {product.is_virtual && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-purple-100 text-purple-800">
                                        Virtual
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Order Details */}
                                <div className="mt-3 grid grid-cols-3 gap-4 text-xs text-gray-500">
                                  <div>
                                    <span className="font-medium">Purchased:</span>
                                    <span className="ml-1">{product.purchased_quantity}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Fulfilled:</span>
                                    <span className="ml-1">{product.fulfilled_quantity}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Refunded:</span>
                                    <span className="ml-1">{product.refunded_quantity}</span>
                                  </div>
                                </div>

                                {/* Group Gifting Info */}
                                {product.is_group_gifting && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded-none">
                                    <p className="text-xs text-blue-800">
                                      <span className="font-medium">Group Gift Contribution:</span>
                                      <span className="ml-1">
                                        {product.group_gifting_contribution_currency} {product.group_gifting_contribution}
                                      </span>
                                    </p>
                                  </div>
                                )}

                                {/* Virtual Product Info */}
                                {product.virtual_product_title && (
                                  <div className="mt-2 p-2 bg-purple-50 rounded-none">
                                    <p className="text-xs text-purple-800">
                                      <span className="font-medium">Virtual Product:</span>
                                      <span className="ml-1">{product.virtual_product_title}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Cover Image Section with Overlay Message - Full Width at Top */}
      <div className="relative mb-8">
        {/* Cover Image - Responsive aspect ratios */}
        <div className="relative w-full overflow-hidden">
          {/* Mobile aspect ratio container */}
          <div 
            className="block md:hidden relative w-full overflow-hidden"
            style={{ aspectRatio: '2 / 1' }}
          >
            {registry.image ? (
              <img
                src={registry.image}
                alt="Registry Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png')"
                }}
              />
            )}
          </div>

          {/* Desktop aspect ratio container */}
          <div 
            className="hidden md:block relative w-full overflow-hidden"
            style={{ aspectRatio: '4 / 1' }}
          >
            {registry.image ? (
              <img
                src={registry.image}
                alt="Registry Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png')"
                }}
              />
            )}
          </div>

          {/* Change Photo Button */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
              id="cover-image-upload"
            />
            <label
              htmlFor="cover-image-upload"
              className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 text-white rounded-none hover:opacity-90 transition-colors cursor-pointer shadow-lg"
              style={{ backgroundColor: '#063B67' }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium text-center leading-tight">
                Change<br />Image
              </span>
            </label>
          </div>
        </div>

        {/* Greeting Message Box - Mobile */}
        <div className="block md:hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[70vw] max-w-[300px] min-w-[200px]">
          <div className="mx-2">
            <div 
              className="w-full p-3 relative shadow-lg flex items-center justify-center"
              style={{ 
                backgroundColor: '#DCE4D2',
                height: '90px'
              }}
            >
              <textarea
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                onBlur={handleFinishEditingGreeting}
                onKeyDown={handleGreetingKeyDown}
                placeholder="Write your message here"
                ref={greetingMessageRef}
                readOnly={!isEditingGreeting}
                className={`w-full h-full bg-transparent border-none resize-none outline-none text-gray-700 placeholder-gray-600 text-sm leading-tight text-center flex items-center font-serif ${
                  !isEditingGreeting ? 'cursor-pointer' : ''
                }`}
                style={{ backgroundColor: 'transparent' }}
                onClick={!isEditingGreeting ? handleEditGreetingMessage : undefined}
              />
              
              {/* Edit Icon */}
              <button 
                type="button"
                onClick={handleEditGreetingMessage}
                className="absolute top-2 right-2"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Greeting Message Box - Desktop */}
        <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 w-[40vw] max-w-[600px] min-w-[400px]">
          <div className="mx-6">
            <div 
              className="w-full p-4 relative shadow-lg flex items-center justify-center"
              style={{ 
                backgroundColor: '#DCE4D2',
                height: '120px'
              }}
            >
              <textarea
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                onBlur={handleFinishEditingGreeting}
                onKeyDown={handleGreetingKeyDown}
                placeholder="Write your message here"
                ref={greetingMessageRef}
                readOnly={!isEditingGreeting}
                className={`w-full h-full bg-transparent border-none resize-none outline-none text-gray-700 placeholder-gray-600 text-lg leading-relaxed text-center flex items-center font-serif ${
                  !isEditingGreeting ? 'cursor-pointer' : ''
                }`}
                style={{ backgroundColor: 'transparent' }}
                onClick={!isEditingGreeting ? handleEditGreetingMessage : undefined}
              />
              
              {/* Edit Icon */}
              <button 
                type="button"
                onClick={handleEditGreetingMessage}
                className="absolute top-3 right-3"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs - Contained */}
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200" ref={tabContentRef}>
            <nav className="-mb-px flex space-x-4 sm:space-x-8 md:space-x-12 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("general")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "general"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Event Info
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "products"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "addresses"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab("guests")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "guests"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Guests
              </button>
              <button
                onClick={() => setActiveTab("share-via-email")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "share-via-email"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Share via Email
              </button>
              <button
                onClick={() => setActiveTab("share-via-sms")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "share-via-sms"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Share via SMS
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === "orders"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Orders
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSave} className="space-y-6 sm:space-y-8 py-6 sm:py-8">
            {renderTabContent()}

            {/* Action Buttons - Mobile Responsive - Only show for general and addresses tabs */}
            {(activeTab === "general" || activeTab === "addresses") && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-6 border-t border-gray-200 gap-4">
        <div></div>
                                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2 hover:opacity-90 transition-colors text-sm sm:text-base"
                    style={{ backgroundColor: '#61C5C3', color: '#222222' }}
                  >
                   Save
                  </button>
              </div>
            )}
          </form>
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
              {guestLoading ? (
                <div className="text-center py-8">
                  <p>Loading guests...</p>
                </div>
              ) : guests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No guests found.</p>
                  <p className="text-sm mt-2">Add your first guest using the form in the Share your list tab.</p>
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
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {guest.first_name} {guest.last_name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {/* Email notification status */}
                              {guest.email && (
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {guest.email_notified ? (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                              {/* SMS notification status */}
                              {guest.phone && (
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {guest.sms_notified ? (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 space-y-1">
                            {guest.email && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {guest.email}
                              </p>
                            )}
                            {guest.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.5 11.5s-.5 2.5 2 5 5 2 5 2l2.103-3.724a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {guest.phone}
                              </p>
                            )}
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
                  className="px-4 py-2 text-white hover:opacity-90 transition-colors rounded"
                  style={{ backgroundColor: '#222222' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrySettings;
