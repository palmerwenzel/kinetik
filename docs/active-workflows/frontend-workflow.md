# Frontend Workflow Template

## Project State

Project Phase: Phase 2 - Groups Feature
Current Task: Refactoring group creation into modular components

## Break the task into manageable component tasks

- [ ] Create directory structure for group creation
  - [ ] Set up create/ directory with \_layout and steps/
  - [ ] Move shared components to components/
  - [ ] Create step-specific files
- [ ] Implement shared form context
  - [ ] Move form state to \_layout
  - [ ] Create step navigation logic
  - [ ] Handle form validation
- [ ] Refactor individual steps
  - [ ] Extract basics step
  - [ ] Extract visibility step
  - [ ] Extract posting step
  - [ ] Extract review step
- [ ] Create shared components
  - [ ] Progress steps indicator
  - [ ] Step header
  - [ ] Navigation buttons

## Understanding Phase Findings

### Documentation Review Results

- Technical Guidelines: Following codebase organization rules for modular components
- Existing Components: Current group creation form with step-based UI
- Similar Features: Profile setup flow with step-based navigation
- Integration Points: Form context shared between steps

### Key Requirements

- Functional:
  - Maintain current form functionality
  - Keep step-based navigation
  - Preserve validation rules
- Technical:
  - Clean separation of concerns
  - Shared form context
  - Type safety across components
- Design:
  - Consistent UI between steps
  - Smooth transitions
  - Clear navigation

## Planning Phase Results

### Architecture Plan

- Component Structure:
  - Layout manages form state and navigation
  - Individual step components handle their UI
  - Shared components for common elements
- State Management:
  - Form context in layout
  - Step state in layout
  - Local UI state in steps

### Technical Approach

- Form Management: React Hook Form + Zod at layout level
- Navigation: Step-based routing with shared context
- UI Components: Reuse existing neumorphic system

## Implementation Checklist

### Setup

- [ ] Create directory structure
- [ ] Set up shared types
- [ ] Configure step navigation

### Development Progress

- [ ] Form context
- [ ] Step components
- [ ] Shared components
- [ ] Navigation logic

### Integration

- [ ] Form validation
- [ ] Step transitions
- [ ] Error handling

## Checkpoints

- [x] Understanding complete
- [x] Planning approved
- [ ] Setup verified
- [ ] Implementation reviewed
- [ ] Integration verified
- [ ] Final review passed

## Notes & Decisions

- Decision 1: Split into modular files for better maintainability
- Decision 2: Use shared form context in layout for state management
