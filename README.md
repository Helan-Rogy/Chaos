# ChaosZen

**ChaosZen** is a comprehensive chaos engineering platform designed to help organizations proactively identify and mitigate system vulnerabilities. By simulating controlled failures, ChaosZen empowers teams to build more resilient, reliable, and fault-tolerant applications.

## 🚀 Key Features

### 🎯 Chaos Engineering
- **Experiment Management**: Create, schedule, and manage chaos experiments with ease
- **Fault Injection**: Inject various fault types including network latency, CPU/memory stress, process termination, and more
- **Experiment Templates**: Pre-defined templates for common failure scenarios (e.g., "Chaos Monkey", "Network Partition")
- **Advanced Targeting**: Target specific services, pods, or nodes with precision

### 📊 Observability & Analytics
- **Real-time Dashboards**: Monitor experiment progress and system health in real-time
- **Historical Analysis**: Track past experiments and identify recurring issues
- **Failure Patterns**: AI-powered analysis to detect patterns in system failures
- **Custom Reports**: Generate detailed reports for stakeholders

### 🛡️ Safety & Controls
- **Blast Radius Control**: Define safe boundaries to prevent uncontrolled failures
- **Automated Rollback**: Automatic rollback to stable state when thresholds are breached
- **Approval Workflows**: Multi-level approval for critical experiments
- **Health Checks**: Pre-experiment validation and post-experiment verification

### 🤖 AI-Powered Insights
- **Predictive Failure Analysis**: Identify potential failure points before they occur
- **Root Cause Analysis**: AI-assisted root cause identification for incidents
- **Experiment Recommendations**: Intelligent suggestions for experiments based on system architecture
- **Anomaly Detection**: Detect unusual system behavior during experiments

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Material UI (MUI) v7
- **Charting**: Recharts
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT + OAuth2
- **Background Tasks**: Celery + Redis
- **Testing**: Pytest

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## 📂 Project Structure

```
ChaosZen/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature-specific modules
│   │   ├── store/         # Redux store configuration
│   │   └── pages/         # Page components
│   └── package.json
├── backend/               # FastAPI backend application
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core utilities and config
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── tasks/         # Celery tasks
│   ├── tests/             # Unit and integration tests
│   └── requirements.txt
├── chaos-agent/           # Kubernetes chaos agent
├── chaos-operator/        # Kubernetes operator for chaos management
├── chaos-sdk/             # SDKs for integrating with ChaosZen
├── docs/                  # Documentation
├── scripts/               # Utility scripts
└── docker-compose.yml     # Local development setup
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm
- Python 3.10+
- Kubernetes cluster (optional, for local testing)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ChaosZen.git
   cd ChaosZen
   ```

2. **Start the backend**
   ```bash
   cd backend
   docker-compose up --build
   ```
   The backend will be available at `http://localhost:8000`

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

4. **Access the dashboard**
   Open `http://localhost:3000` in your browser
   - Default credentials: `admin@example.com` / `password`

### Kubernetes Deployment

1. **Install the Chaos Operator**
   ```bash
   kubectl apply -f chaos-operator/deploy/crds.yaml
   kubectl apply -f chaos-operator/deploy/operator.yaml
   ```

2. **Deploy the Chaos Agent**
   ```bash
   kubectl apply -f chaos-agent/deploy/agent.yaml
   ```

3. **Deploy the Backend**
   ```bash
   kubectl apply -f backend/k8s/deployment.yaml
   kubectl apply -f backend/k8s/service.yaml
   ```

4. **Deploy the Frontend**
   ```bash
   kubectl apply -f frontend/k8s/deployment.yaml
   kubectl apply -f frontend/k8s/service.yaml
   ```

## 📝 Usage

### Creating an Experiment

1. Navigate to **Experiments** > **Create Experiment**
2. Select an experiment template or create a custom experiment
3. Configure the experiment parameters:
   - **Target**: Services, pods, or nodes to target
   - **Fault Type**: Network, CPU, memory, process, etc.
   - **Schedule**: One-time or recurring
   - **Blast Radius**: Define safe boundaries
4. Review and submit the experiment

### Monitoring Experiments

1. Go to **Dashboard** to view real-time experiment status
2. Click on an experiment to see detailed metrics:
   - Success/failure rate
   - Resource utilization
   - Network performance
   - Error logs
3. Analyze failure patterns and trends

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Black + Flake8
- **Commits**: Conventional Commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

## 👥 Team

- [Your Name/Team Name]

## 🔗 Links

- [Project Website](https://your-project-url.com) (if available)
- [Documentation](https://docs.your-project.com) (if available)
- [API Documentation](https://api.your-project.com) (if available)

---

**Built with ❤️ for Chaos Engineering**
