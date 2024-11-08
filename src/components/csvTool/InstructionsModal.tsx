"use client";

import React from "react";

const InstructionsModal = React.memo(
  ({ show, onClose }: { show: boolean; onClose: () => void }) => {
    if (!show) return null;

    return (
      <div
        className="modal d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div 
            className="modal-content"
            style={{ backgroundColor: "rgba(69, 171, 255, 1)", color: "black", textAlign: "left" }} 
          >
            <div className="modal-header">
              <h5 className="modal-title">
                How to Use the CSV Data Visualizer
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="container">
                <section className="mb-4">
                  <h6 className="fw-bold">1. Loading Your Data</h6>
                  <ul>
                    <li>Click the file input at the top of the page</li>
                    <li>Select a CSV file from your computer</li>
                    <li>
                      The file should automatically load and display in the data
                      table below
                    </li>
                    <li>
                      Make sure your CSV file has headers as the first row
                    </li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h6 className="fw-bold">2. Filtering Data</h6>
                  <ul>
                    <li>Use the &quot;Filter Data&quot; panel on the left side</li>
                    <li>Select a field to filter on from the dropdown</li>
                    <li>Choose a filter operator (equals, contains, etc.)</li>
                    <li>Enter a filter value (if required)</li>
                    <li>Click &quot;Add Filter&quot; to apply</li>
                    <li>
                      Multiple filters can be added and will work together
                    </li>
                    <li>Click the &apos;X&apos; on any filter tag to remove it</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h6 className="fw-bold">3. Creating Visualizations</h6>
                  <ul>
                    <li>Use the &quot;Chart Options&quot; panel below the filters</li>
                    <li>Enter a title for your chart</li>
                    <li>Select a chart type (Pie, Bar, Line, or Scatter)</li>
                    <li>
                      Choose fields for X and Y axes:
                      <ul>
                        <li>X-axis: Usually categories or time periods</li>
                        <li>Y-axis: Usually numeric values to analyze</li>
                      </ul>
                    </li>
                    <li>
                      Customize colors for different categories if desired
                    </li>
                    <li>Click &quot;Apply Changes&quot; to update the visualization</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h6 className="fw-bold">4. Chart Types</h6>
                  <ul>
                    <li>
                      <strong>Pie Chart:</strong> Best for showing proportions
                      of a whole
                    </li>
                    <li>
                      <strong>Bar Chart:</strong> Good for comparing quantities
                      across categories
                    </li>
                    <li>
                      <strong>Line Chart:</strong> Ideal for showing trends over
                      time
                    </li>
                    <li>
                      <strong>Scatter Plot:</strong> Perfect for showing
                      relationships between two variables
                    </li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h6 className="fw-bold">5. Exporting Your Work</h6>
                  <ul>
                    <li>
                      &quot;Export Filtered Data&quot; saves your filtered dataset as a
                      new CSV
                    </li>
                    <li>
                      &quot;Export Chart&quot; saves the current visualization as a PNG
                      image
                    </li>
                    <li>Both buttons will prompt you to download the files</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h6 className="fw-bold">6. Tips & Best Practices</h6>
                  <ul>
                    <li>
                      Clean your data before importing (remove extra spaces, fix
                      formatting)
                    </li>
                    <li>Choose appropriate chart types for your data</li>
                    <li>
                      Use filters to focus on specific aspects of your data
                    </li>
                    <li>Consider the scale and units of your measurements</li>
                    <li>Use clear, descriptive titles for your charts</li>
                  </ul>
                </section>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InstructionsModal.displayName = "InstructionsModal";

export default InstructionsModal;
