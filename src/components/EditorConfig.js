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
import { CustomImageTool, CustomButtonTool, HiddenTextBlock } from './GuestList';

export const getEditorConfig = (uuid, selectedColor, buttonText) => ({
  holder: "editorjs",
  autofocus: true,
  placeholder: "Write your invitation...",
  tools: {
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
    },
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
  }
});