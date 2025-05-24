import React, { useState } from "react";
import "./PsuQuoteTool.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Mock PSU product data
const PSU_PRODUCTS = [
  { id: "psu-1", model: "Corsair RM750x", wattage: 750, price: 120, features: "Modular, 80+ Gold" },
  { id: "psu-2", model: "Seasonic Focus GX-650", wattage: 650, price: 110, features: "Full Modular, 80+ Gold" },
  { id: "psu-3", model: "EVGA SuperNOVA 850 G5", wattage: 850, price: 145, features: "Full Modular, 80+ Gold" },
  { id: "psu-4", model: "Be Quiet! Pure Power 11", wattage: 600, price: 89, features: "Semi-Modular, 80+ Gold" },
  { id: "psu-5", model: "Cooler Master MWE Gold 550", wattage: 550, price: 79, features: "Non-Modular, 80+ Gold" }
];

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function PsuQuoteTool() {
  const [availablePsus, setAvailablePsus] = useState(PSU_PRODUCTS);
  const [quotePsus, setQuotePsus] = useState([]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Drag from Available PSUs to Quote
    if (source.droppableId === "psu-list" && destination.droppableId === "psu-quote") {
      const psu = availablePsus[source.index];
      setQuotePsus([...quotePsus, psu]);
    }

    // Reorder within Quote area
    if (source.droppableId === "psu-quote" && destination.droppableId === "psu-quote") {
      setQuotePsus(reorder(quotePsus, source.index, destination.index));
    }
  }

  function removeFromQuote(index) {
    setQuotePsus(quotePsus.filter((_, i) => i !== index));
  }

  // Calculate total
  const total = quotePsus.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="psu-quote-bg">
      <h1 className="psu-title">PSU Quote Tool</h1>
      <div className="psu-main">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* PSU List */}
          <Droppable droppableId="psu-list" isDropDisabled>
            {(provided) => (
              <div className="psu-list" ref={provided.innerRef} {...provided.droppableProps}>
                <h2>Available PSUs</h2>
                {availablePsus.map((psu, index) => (
                  <Draggable draggableId={psu.id} index={index} key={psu.id}>
                    {(provided, snapshot) => (
                      <div
                        className={`psu-item ${snapshot.isDragging ? "dragging" : ""}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <strong>{psu.model}</strong> ({psu.wattage}W)
                        </div>
                        <div className="psu-features">{psu.features}</div>
                        <div className="psu-price">€{psu.price}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* Quote Area */}
          <Droppable droppableId="psu-quote">
            {(provided) => (
              <div className="psu-quote-area" ref={provided.innerRef} {...provided.droppableProps}>
                <h2>Quote Builder</h2>
                {quotePsus.length === 0 && (
                  <div className="psu-drop-hint">Drag PSUs here to build your quote!</div>
                )}
                {quotePsus.map((psu, index) => (
                  <Draggable draggableId={psu.id + "-quote-" + index} index={index} key={psu.id + "-quote-" + index}>
                    {(provided, snapshot) => (
                      <div
                        className={`psu-item quote ${snapshot.isDragging ? "dragging" : ""}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <strong>{psu.model}</strong> ({psu.wattage}W)
                        </div>
                        <div className="psu-features">{psu.features}</div>
                        <div className="psu-price">€{psu.price}</div>
                        <button className="psu-remove" onClick={() => removeFromQuote(index)} title="Remove PSU">🗑️</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <div className="psu-total">
                  Total: <span>€{total}</span>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
