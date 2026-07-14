import React, { useState, useRef } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import openmodal from "../../assets/openmodal.png";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import add from "../../assets/plus.png";
import remove from "../../assets/delete.png";
import toast from "react-hot-toast";
import axios from "axios";
import "./CardModal.css";
const CardModal = () => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [color, setColor] = useState("#ffffff");
  const [priority, setPriority] = useState(null);
  const [title, setTitle] = useState("");
  const [email, setAssignEmail] = useState();
  const [step, setStep] = useState([]);
  const [startDate, setStartDate] = useState();
  const [countTasks, setCountTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const inputPriorityHandler = (e) => {
    const updatedPriority = e.target.value;
    setPriority(updatedPriority);
    setColor(updatedPriority);
  };
  const getBgColor = (value) => {
    return color === value ? "#4affdb" : "#ffffff";
  };
  const inputStepsHandler = () => {
    const newSteps = [...step, { text: "", isChecked: false }];
    setStep(newSteps);
    setTotalTasks((prev) => prev + 1);
  };
  const updateTaskStepHandler = (idx, text) => {
    const newSteps = [...step];
    newSteps[idx].text = text;
    setStep(newSteps);
  };
  const deleteStepHandler = (idx) => {
    step.splice(idx, 1);
    setStep(step);

    setTotalTasks(step.length);
    const count = step.filter((every_step) => every_step.isChecked).length;
    setCountTasks(count);
  };
  const inputTitlehandler = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };
  const checkHandler = (idx) => {
    step[idx].isChecked = !step[idx].isChecked;
    setStep([...step]);
    const count = step.filter((step) => step.isChecked).length;
    setCountTasks(count);
  };
  const assignInputHandler = (e) => {
    const newEmail = e.target.value;
    setAssignEmail(newEmail);
  };
  const forminputs = {
    task_title: title,
    task_priority: priority,
    task_steps: step,
    due_date: startDate,
    count_tasks: countTasks,
    total_tasks: totalTasks,
    assigned_to_email: email,
  };
  const navigate = useNavigate();
  const submitForm = async (e) => {
    try {
      e.preventDefault();
      const Token = localStorage.getItem("Token");
      const local_url = import.meta.env.VITE_LOCAL_URL;
      const response = await axios.post(
        `${local_url}/api/tasks/createTask`,
        forminputs,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(" Task Submitted successfully", response, {
        position: "top-center",
      });
      console.log("85", response);
      navigate("/home");
    } catch (err) {
      console.log("Error encountered in subitting data", err.message);
      toast.error("Task submission failed", {
        position: "top-center",
      });
      navigate("/home");
    }
  };
  return (
    <div>
      <button onClick={onOpenModal}>
        <img
          src={openmodal}
          style={{
            position: "absolute",
            right: "3em",
            top: "1em",
            border: "8em soild red",
            outlineColor: "green",
          }}
          alt="openModal"
          className="openModal"
        />
      </button>
      <Modal
        // overlay: "customModalOverlay",
        // modal: "customModal",
        // modalContent: "customModalContent"
        classNames={{
          modal: "taskmodal",
          overlay: "taskmodaloverlay",
          // modalContent: "taskmodalcontent",
        }}
        open={open}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
      >
        <div className="modalbox">
          <h4>
            Title<span className="req1">*</span>
          </h4>
          <form className="inputtaskmodal" onSubmit={submitForm}>
            <div className="inputtask">
              <input
                type="text"
                className="tasktitleinput"
                placeholder="Enter task title"
                onChange={inputTitlehandler}
                value={title}
              />
            </div>
            <div className="prioritycontainer">
              <h5>
                Select Priority <span className="req1">*</span>
              </h5>

              <span className="priorities">
                <span className="radio1">
                  <input
                    type="radio"
                    name="selectpriority"
                    value="HIGH PRIORITY"
                    id="high"
                    onChange={inputPriorityHandler}
                  />
                  <label
                    style={{ backgroundColor: getBgColor("HIGH PRIORITY") }}
                    htmlFor="high"
                  >
                    HIGH PRIORITY
                  </label>
                </span>
                <span className="radio1">
                  <input
                    type="radio"
                    name="selectpriority"
                    value="MODERATE PRIORITY"
                    id="moderate"
                    onChange={inputPriorityHandler}
                  />
                  <label
                    style={{ backgroundColor: getBgColor("MODERATE PRIORITY") }}
                    htmlFor="moderate"
                  >
                    MODERATE PRORITY
                  </label>
                </span>
                <span className="radio1">
                  <input
                    type="radio"
                    name="selectpriority"
                    value="LOW PRIORITY"
                    id="low"
                    onChange={inputPriorityHandler}
                  />
                  <label
                    style={{ backgroundColor: getBgColor("LOW PRIORITY") }}
                    htmlFor="low"
                  >
                    LOW PRIORITY
                  </label>
                </span>
              </span>
            </div>
            <div className="assigndivcontainer">
              <h4>Assign to</h4>

              <div className="assignspan">
                <input
                  type="email"
                  placeholder="Add an assignee"
                  className="assigninput"
                  value={email}
                  onChange={assignInputHandler}
                />
              </div>
            </div>
            <div className="checklistcontainer">
              <h4>
                Checklist ({countTasks} / {totalTasks})
                <span className="req1">*</span>
              </h4>
              <div className="addsteps">
                {step.map((elem, idx) => {
                  return (
                    <div className="newinputdiv" key={idx}>
                      <input
                        style={{
                          marginLeft: "1em",
                          accentColor: "#B2F3F3",
                        }}
                        type="checkbox"
                        id="check"
                        checked={elem.isChecked}
                        onClick={() => checkHandler(idx)}
                      />
                      <input
                        placeholder="Add a task"
                        className="inputstep"
                        value={elem.text}
                        onChange={(e) =>
                          updateTaskStepHandler(idx, e.target.value)
                        }
                      />
                      <img
                        style={{
                          marginRight: "1em",
                          width: "1.2em",
                          height: "1.2em",
                        }}
                        src={remove}
                        alt="Delete"
                        onClick={() => {
                          deleteStepHandler(idx);
                        }}
                      />
                    </div>
                  );
                })}
                <a onClick={inputStepsHandler}>
                  <img
                    src={add}
                    style={{ width: "0.7em", height: "0.5em" }}
                    alt="addstep"
                  />
                </a>
                &nbsp; Add
              </div>
            </div>
            <div className="taskfootercontainer">
              <div className="duedate" style={{ marginLeft: "-1.5em" }}>
                <DatePicker
                  className="datepicker"
                  style={{ cursor: "pointer", color: "red" }}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Select Due Date"
                />
              </div>
              <div className="taskbuttons">
                <div className="canceldiv">
                  <button id="cancel" className="operationbutton">
                    cancel
                  </button>
                </div>
                <div className="savediv">
                  <button id="save" className="operationbutton">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default CardModal;
