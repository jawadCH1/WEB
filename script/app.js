function getFirstDayOfYear(year) {
  return new Date(year, 0, 1).getDay();
}

const repoUrl = document.getElementById('repoUrl');
const yearSelect = document.getElementById('year');
const displayYear = document.getElementById('display-year');
const heatmap = document.getElementById('heatmap');
const monthLabels = document.getElementById('month-labels');
const contributionCount = document.getElementById('contribution-count');
const clearBtn = document.getElementById('clear');
const exampleProfileBtn = document.getElementById('exampleProfile');
const exampleScriptBtn = document.getElementById('exampleScript');
const githubIssuesBtn = document.getElementById('githubIssues');
const starBtn = document.getElementById('star');
const generateBtn = document.getElementById('generate');
const colorButtons = document.querySelectorAll('.color-button');
const presetSelect = document.getElementById('presetSelect');
let selectedLevel = 4;
let isDragging = false;


