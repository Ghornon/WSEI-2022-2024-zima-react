import { useState, useEffect, useContext } from 'react';
import './Todo.css';
import Loader from '../../components/Loader';
import Todo from '../../components/Todo';
import { TodoType } from '../../types/Todo.types';
import { Context } from '../../Store';

function TodoPage() {
	const [todos, setTodos] = useState([] as TodoType[]);
	const [filter, setFilter] = useState('All');
	const [user, setUser] = useState('');
	const [newTodoTitle, setNewTodoTitle] = useState('');

	const { users, isAdmin } = useContext(Context);

	const handleFilterOnChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
		setFilter(event.target.value);
	};

	const handleUserOnChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
		setUser(event.target.value);
	};

	const handleTaskStatusChange = (id: number) => {
		const updatedTodos = todos.map((todo: TodoType) => {
			if (todo.id == id) todo.completed = !todo.completed;

			return todo;
		});

		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	const handleTaskDelete = (id: number) => {
		const updatedTodos = todos.filter((todo: TodoType) => {
			if (todo.id != id) return todo;
		});

		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	const createNewTodo = async () => {
		const updatedTodos = [...todos];

		const newTodo = {
			title: newTodoTitle,
			completed: false,
			userId: user,
		};

		const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newTodo),
		});

		const result = await response.json();
		updatedTodos.push(result);

		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	useEffect(() => {
		const cache = localStorage.getItem('todos');
		if (cache === null) {
			fetch('https://jsonplaceholder.typicode.com/todos')
				.then((response) => response.json())
				.then((res) => {
					localStorage.setItem('todos', JSON.stringify(res));
					setTodos(res);
				});
		} else {
			setTodos(JSON.parse(cache));
		}
	}, []);

	return (
		<div className="TodoPage">
			<section className="vh-100">
				<div className="container py-5 h-100">
					<div className="row d-flex justify-content-center align-items-center h-100">
						<div className="col">
							<div className="card bg-custom" id="list1">
								<div className="card-body py-4 px-4 px-md-5">
									<p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
										<i className="bi bi-card-checklist"></i>
										My Todo-s
									</p>

									<div className="pb-2">
										<div className="card">
											<div className="card-body">
												<div className="d-flex flex-row align-items-center">
													<input
														type="text"
														className="form-control me-sm-3"
														id="exampleFormControlInput1"
														placeholder="Add new..."
														value={newTodoTitle}
														onChange={(event) => {
															setNewTodoTitle(event.target.value);
														}}
													/>
													<button
														type="button"
														className="btn btn-primary my-3 my-sm-0"
														onClick={createNewTodo}
													>
														Add
													</button>
												</div>
												<div className="d-flex flex-row align-items-center pt-2">
													<select
														className="form-select"
														value={user}
														onChange={handleUserOnChange}
													>
														{users.length
															? users.map((user) => (
																	<option
																		key={user.id}
																		value={user.id}
																	>
																		{user.name}
																	</option>
															  ))
															: ''}
													</select>
												</div>
											</div>
										</div>
									</div>

									<hr className="my-4" />

									<div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
										<p className="small mb-0 me-2 text-muted">Filter</p>
										<select
											className="form-select"
											value={filter}
											onChange={handleFilterOnChange}
										>
											<option value="All">All</option>
											<option value="Completed">Completed</option>
											<option value="Active">Active</option>
										</select>
										<a
											href="#!"
											data-mdb-toggle="tooltip"
											title="Ascending"
											className="todo-link"
										>
											<i className="fas fa-sort-amount-down-alt ms-2"></i>
										</a>
									</div>

									<table className="table mb-0">
										<thead>
											<tr>
												<th scope="col">Team Member</th>
												<th scope="col">Task</th>
												<th scope="col">Is done?</th>
												{isAdmin ? <th scope="col">Actions</th> : ''}
											</tr>
										</thead>
										<tbody>
											{todos.length > 0 ? (
												todos
													.filter((todo: TodoType) => {
														if (filter == 'All') return todo;
														else if (
															filter == 'Completed' &&
															todo.completed
														)
															return todo;
														else if (
															filter == 'Active' &&
															!todo.completed
														)
															return todo;
													})
													.map((todo: TodoType) => (
														<Todo
															key={todo.id}
															todo={todo}
															handleTaskStatusChange={
																handleTaskStatusChange
															}
															handleTaskDelete={handleTaskDelete}
														/>
													))
											) : (
												<Loader />
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default TodoPage;
