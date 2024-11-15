/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'html2pdf.js' {

    function html2pdf(): {
  
      from: (element: HTMLElement) => any;
  
      save: () => Promise<void>;
  
      set: (options: any) => any;
  
    };
  
    export default html2pdf;
  
  }