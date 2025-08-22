import SwiftUI
import UserNotifications

// Simple, ADHD-friendly to-do list using SwiftUI.
// Features inspired by research on ADHD include:
// 1. Minimalist UI to reduce distractions.
// 2. Breaking work into small actionable tasks.
// 3. Clear visual cues (colors, strikethrough) for task status.
// 4. Timely notifications to aid time management.
// 5. Persistent storage so tasks don't vanish between sessions.

struct TaskItem: Identifiable, Codable {
    var id = UUID()
    var title: String
    var dueDate: Date
    var isCompleted: Bool = false

    var isOverdue: Bool { !isCompleted && dueDate < Date() }
}

class TaskViewModel: ObservableObject {
    @Published var tasks: [TaskItem] {
        didSet { saveTasks() }
    }

    private let fileURL: URL = {
        let fm = FileManager.default
        let docs = fm.urls(for: .documentDirectory, in: .userDomainMask).first!
        return docs.appendingPathComponent("Tasks.json")
    }()

    init() {
        self.tasks = []
        loadTasks()
    }

    func addTask(title: String, dueDate: Date) {
        let task = TaskItem(title: title, dueDate: dueDate)
        tasks.append(task)
        scheduleNotification(for: task)
    }

    func toggleComplete(_ task: TaskItem) {
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index].isCompleted.toggle()
        }
    }

    func removeTask(at offsets: IndexSet) {
        tasks.remove(atOffsets: offsets)
    }

    private func saveTasks() {
        if let data = try? JSONEncoder().encode(tasks) {
            try? data.write(to: fileURL)
        }
    }

    private func loadTasks() {
        guard let data = try? Data(contentsOf: fileURL),
              let saved = try? JSONDecoder().decode([TaskItem].self, from: data) else { return }
        tasks = saved
    }

    private func scheduleNotification(for task: TaskItem) {
        let content = UNMutableNotificationContent()
        content.title = "Task Reminder"
        content.body = task.title
        content.sound = .default

        let interval = max(1, task.dueDate.timeIntervalSinceNow)
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: interval, repeats: false)
        let request = UNNotificationRequest(identifier: task.id.uuidString, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }
}

struct ContentView: View {
    @StateObject var viewModel = TaskViewModel()
    @State private var newTitle = ""
    @State private var newDate = Date()

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    TextField("New Task", text: $newTitle)
                    DatePicker("Due", selection: $newDate, displayedComponents: .date)
                    Button("Add") {
                        guard !newTitle.isEmpty else { return }
                        viewModel.addTask(title: newTitle, dueDate: newDate)
                        newTitle = ""
                        newDate = Date()
                    }
                }
                List {
                    ForEach(viewModel.tasks) { task in
                        HStack {
                            Button(action: { viewModel.toggleComplete(task) }) {
                                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                                    .foregroundColor(task.isCompleted ? .green : .accentColor)
                            }
                            VStack(alignment: .leading) {
                                Text(task.title)
                                    .strikethrough(task.isCompleted)
                                Text(task.dueDate, style: .date)
                                    .font(.caption)
                                    .foregroundColor(task.isOverdue ? .red : .secondary)
                            }
                        }
                    }
                    .onDelete(perform: viewModel.removeTask)
                }
            }
            .navigationTitle("Focus Tasks")
        }
        .onAppear {
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, _ in
                if !granted { print("Notifications not allowed") }
            }
        }
    }
}

@main
struct ADHDToDoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

