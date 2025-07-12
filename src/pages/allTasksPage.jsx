import TaskList from "../components/tasks/tasksList";
import Nav from "../components/ui/Nav";
import LeftNav from "../components/dashboard/leftNav";

function AllTasksPage() {
  return (
    <>
      <Nav />
      <div className="pt-20 sm:pt-24 flex bg-light-background dark:bg-gray-900 h-screen overflow-hidden">
        <LeftNav />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="h-full">
            <TaskList />
          </div>
        </div>
      </div>
    </>
  );
}

export default AllTasksPage;
