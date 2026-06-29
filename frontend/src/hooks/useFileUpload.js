import { useState } from "react";

export default function useFileUpload() {
  const [files, setFiles] = useState({
    cccdFile: null,
    cccdFrontFile: null,
    cccdBackFile: null,
    hocBaFile: null,
    bangTNFile: null,
    anhTheFile: null,
    giayKhaiSinhFile: null,
    chungChiFile: null,
    hoKhauFile: null,
  });

  const setFile = (key) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const resetFiles = () => {
    setFiles({
      cccdFile: null,
      cccdFrontFile: null,
      cccdBackFile: null,
      hocBaFile: null,
      bangTNFile: null,
      anhTheFile: null,
      giayKhaiSinhFile: null,
      chungChiFile: null,
      hoKhauFile: null,
    });
  };

  const uploadedFilesCount = Object.values(files).filter(Boolean).length;

  return { files, setFile, setFiles, resetFiles, uploadedFilesCount };
}
