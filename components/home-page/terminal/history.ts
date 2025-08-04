export class History {
  private history: string[] = []
  private currentIndex = 0
  private tempCommand = ''

  add(command: string): void {
    // Don't add empty commands
    if (!command.trim()) return

    // Add the command to history
    this.history.push(command)

    // Reset the index to point beyond the last item
    this.currentIndex = this.history.length

    // Clear temporary command
    this.tempCommand = ''
  }

  navigateUp(currentInput: string): string | null {
    // If we're at the end of history (not navigating yet), save current input
    if (this.currentIndex === this.history.length) {
      this.tempCommand = currentInput
    }

    // Check if there's any history to navigate
    if (this.history.length === 0) return null

    // Check if we can go further back
    if (this.currentIndex > 0) {
      this.currentIndex--
      return this.history[this.currentIndex]
    }

    return null
  }

  navigateDown(): string | null {
    // Can't go further forward
    if (this.currentIndex >= this.history.length - 1) {
      // If we're at the end, restore the temporary command
      if (this.currentIndex === this.history.length - 1) {
        this.currentIndex = this.history.length
        return this.tempCommand
      }
      return null
    }

    // Move down in history
    this.currentIndex++

    // If we've reached the end, return the temp command
    if (this.currentIndex === this.history.length) {
      return this.tempCommand
    }

    return this.history[this.currentIndex]
  }

  reset(): void {
    this.currentIndex = this.history.length
    this.tempCommand = ''
  }

  getHistory(): string[] {
    return [...this.history]
  }

  clear(): void {
    this.history = []
    this.currentIndex = 0
    this.tempCommand = ''
  }
}

// Create a singleton instance
export const terminalHistory = new History()
