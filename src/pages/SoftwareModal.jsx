import React, { useState, useEffect } from "react";
import "./SoftwareModal.css";

export default function SoftwareModal({ isCloud, onSave, onClose, initialSelections = {} }) {
  // Define the software matrix based on the table structure
  const SOFTWARE_MATRIX = [
    {
      mainHeading: "Synguard Platform add on's",
      subCategories: [
        {
          subHeading: "Multi Realm",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-MultiRealm / S00532",
              cloudProduct: "H-Synguard-MultiRealm / S00532H",
              quantity: false,
              description: "Multi Realm add-on for Synguard Platform"
            }
          ]
        },
        {
          subHeading: "Synguard View",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-View / S00528",
              cloudProduct: "H-Synguard-View / S00528H",
              quantity: false,
              description: "Synguard View add-on license"
            },
            {
              name: "Qty",
              type: "number",
              onPremProduct: "Synguard-View-Object / S03290",
              cloudProduct: "H-Synguard-View-Object / S03290H",
              quantity: true,
              description: "Synguard View Object license"
            }
          ]
        },
        {
          subHeading: "Advanced event tree",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-Event-Tree / S00527",
              cloudProduct: "H-Synguard-Event-Tree / S00527H",
              quantity: false,
              description: "Advanced Event Tree add-on for Synguard"
            }
          ]
        },
        {
          subHeading: "Badge & visitor label printing",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "SynReg-Lic-Print / S00723",
              cloudProduct: "H-SynReg-Lic-Print / S00723H",
              quantity: false,
              description: "Badge & Visitor Label Printing License"
            }
          ]
        }
      ]
    },
    {
      mainHeading: "Visitor Management",
      subCategories: [
        {
          subHeading: "Visitor management module",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-Visitor / S02975",
              cloudProduct: "H-Synguard-Visitor / S02975H",
              quantity: false,
              description: "Visitor Management Module License"
            }
          ]
        },
        {
          subHeading: "Visitor Self Service",
          items: [
            {
              name: "Qty",
              type: "number",
              onPremProduct: "Synguard-Visitor-SelfService / S02975",
              cloudProduct: "H-Synguard-Visitor-SelfService / S02975H",
              quantity: true,
              description: "Visitor Self Service Kiosk License"
            }
          ]
        }
      ]
    },
    {
      mainHeading: "Communication",
      subCategories: [
        {
          subHeading: "SMS Service",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-SMS / S03367",
              cloudProduct: "H-Synguard-SMS / S03367H",
              quantity: false,
              description: "SMS Communication Service"
            }
          ]
        }
      ]
    },
    {
      mainHeading: "Parking Management",
      subCategories: [
        {
          subHeading: "Parking module",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-Parking / S02674",
              cloudProduct: "H-Synguard-Parking / S02674H",
              quantity: false,
              description: "Parking Management Module License"
            },
            {
              name: "Qty",
              type: "number",
              onPremProduct: "Synguard-Parking / S02674",
              cloudProduct: "H-Synguard-Parking / S02674H",
              quantity: true,
              description: "Parking Management License - per vehicle"
            }
          ]
        }
      ]
    },
    {
      mainHeading: "CCTV & PSIM",
      subCategories: [
        {
          subHeading: "Milestone",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-Milestone-Integration",
              cloudProduct: "H-Synguard-Milestone-Integration",
              quantity: false,
              description: "Milestone CCTV Integration"
            }
          ]
        },
        {
          subHeading: "Network Optix",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-NetworkOptix-Integration",
              cloudProduct: "H-Synguard-NetworkOptix-Integration",
              quantity: false,
              description: "Network Optix CCTV Integration"
            }
          ]
        },
        {
          subHeading: "Digifort",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-Digifort-Integration",
              cloudProduct: "H-Synguard-Digifort-Integration",
              quantity: false,
              description: "Digifort CCTV Integration"
            }
          ]
        },
        {
          subHeading: "Advancis",
          items: [
            {
              name: "Enable",
              type: "on/off",
              onPremProduct: "Synguard-Advancis-Integration",
              cloudProduct: "H-Synguard-Advancis-Integration",
              quantity: false,
              description: "Advancis PSIM Integration"
            }
          ]
        }
      ]
    }
  ];

  const [selections, setSelections] = useState({});
  const [parentEnabled, setParentEnabled] = useState({});

  // Initialize selections state and handle initial selections from props
  useEffect(() => {
    const initialSelectionsState = {};
    const initialParentEnabledState = {};
    
    // Create structure for all possible selections first
    SOFTWARE_MATRIX.forEach((mainCategory) => {
      mainCategory.subCategories.forEach((subCategory) => {
        const parentId = `${mainCategory.mainHeading}-${subCategory.subHeading}`;
        initialParentEnabledState[parentId] = false;
        
        subCategory.items.forEach((item) => {
          const id = `${parentId}-${item.name}`;
          initialSelectionsState[id] = {
            enabled: false,
            quantity: item.quantity ? 1 : 0,
            mainHeading: mainCategory.mainHeading,
            subHeading: subCategory.subHeading,
            name: item.name,
            type: item.type,
            product: isCloud ? item.cloudProduct : item.onPremProduct,
            description: item.description,
            quantityEnabled: item.quantity,
            parentId: parentId
          };
        });
      });
    });
    
    // Now apply any initialSelections from props
    if (initialSelections && Object.keys(initialSelections).length > 0) {
      // First, mark the parent categories as enabled
      Object.keys(initialSelections).forEach(key => {
        // Find corresponding parent
        for (const mainCategory of SOFTWARE_MATRIX) {
          for (const subCategory of mainCategory.subCategories) {
            const fullName = `${mainCategory.mainHeading} - ${subCategory.subHeading}`;
            if (key.includes(fullName)) {
              const parentId = `${mainCategory.mainHeading}-${subCategory.subHeading}`;
              initialParentEnabledState[parentId] = true;
              break;
            }
          }
        }
      });
      
      // Now set the item selections
      Object.keys(initialSelectionsState).forEach(id => {
        const item = initialSelectionsState[id];
        const fullName = `${item.mainHeading} - ${item.subHeading}`;
        
        if (initialSelections[fullName] && initialSelections[fullName].enabled) {
          item.enabled = true;
          
          // If it's a quantity item, set the quantity
          if (item.quantityEnabled && initialSelections[fullName].quantity) {
            item.quantity = initialSelections[fullName].quantity;
          }
        }
      });
    }
    
    setSelections(initialSelectionsState);
    setParentEnabled(initialParentEnabledState);
  }, [isCloud, initialSelections]);

  const handleParentToggle = (parentId) => {
    // Toggle the parent's enabled state
    setParentEnabled(prev => {
      const newState = {
        ...prev,
        [parentId]: !prev[parentId]
      };
      
      // Update all child items with parent state
      setSelections(prevSelections => {
        const updatedSelections = { ...prevSelections };
        
        Object.keys(updatedSelections).forEach(id => {
          if (updatedSelections[id].parentId === parentId) {
            if (updatedSelections[id].type === "on/off") {
              updatedSelections[id].enabled = newState[parentId];
            }
          }
        });
        
        return updatedSelections;
      });
      
      return newState;
    });
  };

  const handleQuantityChange = (id, value) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: Math.max(1, parseInt(value) || 1)
      }
    }));
  };

  const handleAddToRequirements = () => {
    const selectedItems = [];
    
    // Convert selections to products to add to the requirements
    Object.keys(selections).forEach((id) => {
      const item = selections[id];
      
      // Only add enabled items
      if (item.enabled || (parentEnabled[item.parentId] && item.type === "on/off")) {
        if (item.type === "on/off") {
          // Add on/off items with quantity of 1
          selectedItems.push({
            articleNumber: item.product.split('/').pop()?.trim(),
            model: item.product.split('/')[0]?.trim(),
            description: item.description || `${item.mainHeading} - ${item.subHeading}`,
            qty: 1,
            msrpGBP: 0, // To be populated in Requirements component
            discountStandard: 0,
            smc: 0,
            name: `${item.mainHeading} - ${item.subHeading}` // For tracking selection state
          });
        }
      }
      
      // Add quantity items if parent is enabled
      if (parentEnabled[item.parentId] && item.type === "number" && item.quantity > 0) {
        selectedItems.push({
          articleNumber: item.product.split('/').pop()?.trim(),
          model: item.product.split('/')[0]?.trim(),
          description: item.description || `${item.mainHeading} - ${item.subHeading} (${item.quantity})`,
          qty: item.quantity,
          msrpGBP: 0, // To be populated in Requirements component
          discountStandard: 0,
          smc: 0,
          name: `${item.mainHeading} - ${item.subHeading}` // For tracking selection state
        });
      }
    });
    
    // Call onSave with the selected items
    onSave(selectedItems);
  };

  return (
    <div className="software-modal-overlay">
      <div className="software-modal">
        <div className="software-modal-header">
          <h2>Select Software Components</h2>
          <span className="close-button" onClick={onClose}>×</span>
        </div>
        
        <div className="software-modal-content">
          {SOFTWARE_MATRIX.map((mainCategory) => (
            <div key={mainCategory.mainHeading} className="software-category">
              <h3 className="main-heading">{mainCategory.mainHeading}</h3>
              
              {mainCategory.subCategories.map((subCategory) => {
                const parentId = `${mainCategory.mainHeading}-${subCategory.subHeading}`;
                const isParentEnabled = parentEnabled[parentId] || false;
                
                return (
                  <div key={parentId} className="software-subcategory">
                    <div className="subcategory-header">
                      <div className="toggle-container">
                        <input 
                          type="checkbox"
                          id={parentId}
                          checked={isParentEnabled}
                          onChange={() => handleParentToggle(parentId)}
                          className="toggle-input"
                        />
                        <label htmlFor={parentId} className="toggle-label">
                          <h4 className="sub-heading">{subCategory.subHeading}</h4>
                        </label>
                      </div>
                    </div>
                    
                    {isParentEnabled && (
                      <div className="software-items">
                        {subCategory.items.filter(item => item.type === "number").map((item) => {
                          const id = `${parentId}-${item.name}`;
                          const currentSelection = selections[id] || { quantity: 1 };
                          
                          return (
                            <div key={id} className="software-item quantity-container">
                              <label className="quantity-label">
                                {item.name}:
                                <input 
                                  type="number"
                                  min="1"
                                  value={currentSelection.quantity}
                                  onChange={(e) => handleQuantityChange(id, e.target.value)}
                                  className="quantity-input"
                                />
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="software-modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleAddToRequirements}>Add to Requirements</button>
        </div>
      </div>
    </div>
  );
}