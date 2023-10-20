import React, { useEffect, useRef } from "react";

export default function App() {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const PSPDFKitInstance = useRef(null);

  const extractFormData = () => {
    if (PSPDFKitInstance.current) {
      const formFieldValues = PSPDFKitInstance.current.getFormFieldValues();
      console.log("Extracted Form Data>>>>>", formFieldValues);

      const formDataJSON = JSON.stringify(formFieldValues, null, 2);
      console.log("JSON data >>>>?>", formDataJSON);
    } else {
      console.error("pdf is not loaded!!! errrr");
    }
  };

  useEffect(() => {
    console.log("hey");
    const container = containerRef.current;

    const loadPDF = async (file) => {
      const PSPDFKit = await import("pspdfkit");

      if (PSPDFKitInstance.current) {
        PSPDFKitInstance.current.unload(container);
      }

      const arrayBuffer = await readFileAsArrayBuffer(file);
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      PSPDFKitInstance.current = await PSPDFKit.load({
        container,
        document: blobUrl,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
      });
    };

    const readFileAsArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          resolve(event.target.result);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    };

    const handleFileChange = () => {
      const fileInput = fileInputRef.current;
      const file = fileInput.files[0];

      if (file) {
        loadPDF(file);
      }
    };

    fileInputRef.current.addEventListener("change", handleFileChange);

    return () => {
      if (PSPDFKitInstance.current) {
        PSPDFKitInstance.current.unload(container);
      }
      fileInputRef.current.removeEventListener("change", handleFileChange);
    };
  }, []);

  return (
    <div>
      <input type="file" ref={fileInputRef} accept=".pdf" />
      <div ref={containerRef} style={{ height: "100vh" }} />

      <button
        id="saveButton"
        style={{ position: "absolute", top: "10px", right: "10px" }}
        onClick={extractFormData}
      >
        Save PDF
      </button>
    </div>
  );
}
