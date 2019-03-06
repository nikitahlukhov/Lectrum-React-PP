// Core
import React, { createRef, PureComponent } from "react";

// Instruments
import Styles from "./styles.m.css";
import Checkbox from "theme/assets/Checkbox";
import Star from "theme/assets/Star";
import Edit from "theme/assets/Edit";
import Remove from "theme/assets/Remove";

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    taskInput = createRef();

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _setTaskEditingState = (isTaskEditing) => {
        this.setState({ isTaskEditing }, () => {
            if (isTaskEditing) {
                this._taskInputFocus();
            }
        });
    };

    _updateTask = () => {
        const { newMessage } = this.state;
        const { _updateTaskAsync, message } = this.props;
        const task = this._getTaskShape({ message: newMessage });

        this._setTaskEditingState(false);
        if (message === newMessage) {
            return null;
        }
        _updateTaskAsync(task);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (!newMessage) {
            return null;
        }
        if (event.key === "Enter") {
            this._updateTask();
        }
        if (event.key === "Escape") {
            this._cancelUpdatingTaskMessage();
        }
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage:    message,
        });
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;
        const task = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(task);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        const task = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(task);
    };

    render () {
        const { completed, favorite } = this.props;

        const { newMessage, isTaskEditing } = this.state;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
