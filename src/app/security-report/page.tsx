"use client";

import React, { useState, useRef } from 'react';
import { AlertCircle, HelpCircle, Send, CheckCircle } from 'lucide-react';
import { database } from "../../../.firebase/firebase";
import { ref, push } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import styles from "../../styles/securityReport.module.css";
import ReCAPTCHA from 'react-google-recaptcha';

export default function SecurityReport() {
  const [formData, setFormData] = useState({
    reporterName: { 
      value: '', 
      helper: 'Your name will be kept confidential and only used to follow up if needed.'
    },
    reporterEmail: { 
      value: '', 
      helper: 'We will use this to update you on the status of your report.'
    },
    issueType: { 
      value: '', 
      helper: 'Common types include: Data Exposure, Authentication Issues, Access Control, etc.'
    },
    shortDescription: { 
      value: '', 
      helper: 'Brief overview of the security issue - what is the main concern?'
    },
    howToReproduce: { 
      value: '', 
      helper: 'Step-by-step instructions that would help our team recreate the issue.'
    },
    whereFound: { 
      value: '', 
      helper: 'Which part of the application? (URL, feature, page, etc.)'
    },
    impact: { 
      value: '', 
      helper: 'What could happen if this vulnerability was exploited?'
    },
    suggestedFix: { 
      value: '', 
      helper: 'Optional: Any ideas on how to fix this issue?'
    }
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  
  //Captcha
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    try {
      //CAPTCHA
      const token = await recaptchaRef.current?.getValue();
      if (!token) {
        setStatus({ type: 'error', message: 'Please complete the reCAPTCHA verification.' });
        return;
      }

      // Format data for Firebase
      const reportData = {
        timestamp: new Date().toISOString(),
        reporter: {
          name: formData.reporterName.value,
          email: formData.reporterEmail.value
        },
        issue: {
          type: formData.issueType.value,
          description: formData.shortDescription.value,
          reproduction: formData.howToReproduce.value,
          location: formData.whereFound.value,
          potentialImpact: formData.impact.value,
          suggestedFix: formData.suggestedFix.value
        },
        status: 'new'
      };

      // Push to Firebase under 'Security' node
      const securityRef = ref(database, 'Security');
      await push(securityRef, reportData);

      setStatus({
        type: 'success',
        message: 'Report submitted successfully. Thank you for helping us improve security!'
      });

      // Reset form
      const resetForm = Object.fromEntries(
        Object.entries(formData).map(([key, field]) => [key, { ...field, value: '' }])
      );
      setFormData(resetForm as typeof formData);

    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to submit report. Please try again.'
      });
      console.error('Error submitting report:', error);
    }
  };

  const renderTooltip = (text: string) => (
    <Tooltip className="custom-tooltip">
      {text}
    </Tooltip>
  );

  const renderField = (
    fieldName: keyof typeof formData,
    label: string,
    type: 'text' | 'email' | 'textarea' = 'text',
    rows: number = 3
  ) => (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-2">
        <label className="form-label mb-0">{label}</label>
        <OverlayTrigger
          placement="right"
          overlay={renderTooltip(formData[fieldName].helper)}
        >
          <button 
            type="button" 
            className="btn btn-link text-primary p-0 ms-2"
            style={{ backgroundColor: 'transparent' }}
          >
            <HelpCircle size={16} />
          </button>
        </OverlayTrigger>
      </div>
      {type === 'textarea' ? (
        <textarea
          className="form-control"
          value={formData[fieldName].value}
          onChange={(e) => setFormData({
            ...formData,
            [fieldName]: { ...formData[fieldName], value: e.target.value }
          })}
          rows={rows}
          required
        />
      ) : (
        <input
          type={type}
          className="form-control"
          value={formData[fieldName].value}
          onChange={(e) => setFormData({
            ...formData,
            [fieldName]: { ...formData[fieldName], value: e.target.value }
          })}
          required
        />
      )}
    </div>
  );

  return (
    <div className={`container py-5 ${styles.securityReportContainer}`}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className={`card shadow-sm ${styles.reportCard}`}>
            <div className="card-body p-4">
              <div className={`text-center mb-4 ${styles.headerSection}`}>
                <AlertCircle className={`${styles.alertIcon} mb-3`} size={40} />
                <h2 className={styles.title}>Report a Security Issue</h2>
                <p className={`text-muted ${styles.subtitle}`}>
                  Help us protect our users by reporting potential security vulnerabilities.
                  All reports will be investigated promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {renderField('reporterName', 'Your Name')}
                {renderField('reporterEmail', 'Your Email', 'email')}
                {renderField('issueType', 'Type of Security Issue')}
                {renderField('shortDescription', 'What\'s the Issue?', 'textarea')}
                {renderField('howToReproduce', 'How Can We Reproduce This?', 'textarea')}
                {renderField('whereFound', 'Where Did You Find This?')}
                {renderField('impact', 'Potential Impact', 'textarea')}
                {renderField('suggestedFix', 'Suggested Fix (Optional)', 'textarea')}
                
                <ReCAPTCHA className= "py-3"
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                 />

                <button 
                  type="submit" 
                  className={`btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 ${styles.submitButton}`}
                >
                  <Send size={18} />
                  Submit Report
                </button>
              </form>

              {status.type && (
                <div className={`alert ${status.type === 'success' ? styles.successAlert : styles.errorAlert} mt-4 d-flex align-items-center gap-2`}>
                  {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {status.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}