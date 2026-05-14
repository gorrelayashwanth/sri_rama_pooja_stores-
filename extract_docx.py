import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # The namespace for Word XML
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            text = []
            for paragraph in tree.findall('.//w:p', ns):
                para_text = []
                for run in paragraph.findall('.//w:r', ns):
                    for t in run.findall('.//w:t', ns):
                        if t.text:
                            para_text.append(t.text)
                if para_text:
                    text.append(''.join(para_text))
            
            return '\n'.join(text)
    except Exception as e:
        return f"Error reading {docx_path}: {e}"

def main():
    directory = Path('.')
    for docx_file in directory.glob('*.docx'):
        txt = extract_text_from_docx(docx_file)
        txt_file = directory / (docx_file.stem + '.txt')
        txt_file.write_text(txt, encoding='utf-8')
        print(f"Extracted {docx_file.name} to {txt_file.name}")

if __name__ == '__main__':
    main()
