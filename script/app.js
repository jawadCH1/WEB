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

const presets = {
  smile: [
    [3,2,4],[3,4,4],[4,1,4],[4,5,4],[5,1,4],[5,5,4],[6,2,4],[6,4,4],[4,3,2],[5,3,2],
  ],
  heart: [
    [2,1,4],[2,2,4],[2,4,4],[2,5,4],[3,0,4],[3,3,4],[3,6,4],[4,1,4],[4,5,4],[5,2,4],[5,4,4],[6,3,4],
  ],
  hi: [
    [2,1,4],[2,2,4],[2,3,4],[2,5,4],[2,6,4],[3,2,4],[3,4,4],[4,1,4],[4,2,4],[4,3,4],[4,4,4],[4,5,4]
  ],
  checker: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if((w+d)%2===0)arr.push([w,d,2]); return arr;
  },
  diagonal: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if(w===d)arr.push([w,d,3]); return arr;
  },
  border: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if(w===0||w===numWeeks-1||d===0||d===numDays-1)arr.push([w,d,2]); return arr;
  },
  zigzag: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if((w%2===0&&d%2===0)||(w%2===1&&d%2===1))arr.push([w,d,3]); return arr;
  },
  x: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if(w===d||w===numDays-1-d)arr.push([w,d,4]); return arr;
  },
  o: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if((w>0&&w<numWeeks-1&&d>0&&d<numDays-1)&&!(w===1&&d===1)&&!(w===numWeeks-2&&d===numDays-2))arr.push([w,d,2]);
    for(let w=0;w<numWeeks;w++) arr.push([w,0,4],[w,numDays-1,4]);
    for(let d=0;d<numDays;d++) arr.push([0,d,4],[numWeeks-1,d,4]);
    return arr;
  },
  half: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if(d>3)arr.push([w,d,3]); return arr;
  },
  fullgreen1: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      arr.push([w,d,1]); return arr;
  },
  fullgreen4: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      arr.push([w,d,4]); return arr;
  },
  random: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)for(let d=0;d<numDays;d++)
      if(Math.random()>0.6)arr.push([w,d,Math.floor(Math.random()*5)]); return arr;
  },
  // BATIK 1: zigzag selang seling level 1
  batik1: function(numWeeks, numDays){
    let arr=[]; for(let d=0;d<numDays;d++)
      for(let w=0;w<numWeeks;w++)
        if((w+d%2)%2===0)arr.push([w,d,1]);
    return arr;
  },
  // BATIK 2: diagonal zigzag
  batik2: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)
      for(let d=0;d<numDays;d++)
        if((w-d)%4===0||(w+d)%4===0)arr.push([w,d,1]);
    return arr;
  },
  // BATIK 3: wave
  batik3: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)
      for(let d=0;d<numDays;d++)
        if(((w+Math.floor(d/2))%4===0))arr.push([w,d,2]);
        else if(((w+Math.floor(d/2))%4===1))arr.push([w,d,1]);
    return arr;
  },
  // STAIRCASE: tangga naik
  stairs: function(numWeeks, numDays){
    let arr=[]; for(let w=0;w<numWeeks;w++)
      for(let d=0;d<numDays;d++)
        if(w===d||w===d-1||w===d+1)arr.push([w,d,4]);
    return arr;
  },
  // ARROW: bentuk panah kanan
  arrow: function(numWeeks, numDays){
    let arr=[]; 
    let mid = Math.floor(numDays/2);
    for(let w=0;w<numWeeks;w++) arr.push([w,mid,4]);
    for(let i=-2;i<=2;i++) arr.push([numWeeks-1,mid+i,4]);
    arr.push([numWeeks-2,mid-1,4],[numWeeks-2,mid+1,4]);
    arr.push([numWeeks-3,mid-2,4],[numWeeks-3,mid+2,4]);
    return arr;
  },
  // DIAMOND (ketupat)
  diamond: function(numWeeks, numDays){
    let arr=[]; let midw=Math.floor(numWeeks/2), midd=Math.floor(numDays/2);
    for(let w=0;w<numWeeks;w++)
      for(let d=0;d<numDays;d++)
        if(Math.abs(w-midw)+Math.abs(d-midd)<=Math.min(midw,midd))
          arr.push([w,d,3]);
    return arr;
  },
  // PLUS
  plus: function(numWeeks, numDays){
    let arr=[]; let midw=Math.floor(numWeeks/2), midd=Math.floor(numDays/2);
    for(let w=0;w<numWeeks;w++) arr.push([w,midd,4]);
    for(let d=0;d<numDays;d++) arr.push([midw,d,4]);
    return arr;
  },
  // TETRIS L
  tetris: function(numWeeks, numDays){
    let arr=[]; 
    for(let w=0;w<3&&w<numWeeks;w++) arr.push([w,0,4]);
    for(let d=0;d<3&&d<numDays;d++) arr.push([2,d,4]);
    return arr;
  },

  // ==============================
  // Tambahan random1 sampai random10
  random1: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random2: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random3: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random4: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random5: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random6: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random7: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random8: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random9: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  },
  random10: function(numWeeks, numDays){
    let arr=[]; 
    let count = 0;
    while (count < 250) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
      count++;
    }
    while (arr.length < 310) {
      let w = Math.floor(Math.random() * numWeeks);
      let d = Math.floor(Math.random() * numDays);
      let level = Math.floor(Math.random() * 4) + 1;
      arr.push([w,d,level]);
    }
    return arr;
  }
  // ==============================
};

presetSelect.addEventListener('change', () => {
  const val = presetSelect.value;
  buildCalendar(parseInt(yearSelect.value));
  setTimeout(() => {
    const cells = Array.from(document.querySelectorAll('.cell')).filter(cell => cell.style.visibility !== 'hidden');
    const numWeeks = getNumberOfWeeks(parseInt(yearSelect.value));
    const numDays = 7;
    let pattern = [];
    if(typeof presets[val]==='function'){
      pattern = presets[val](numWeeks,numDays);
    }else{
      pattern = presets[val]||[];
    }
    pattern.forEach(([week, day, level]) => {
      const idx = week*7 + day;
      if (cells[idx]) {
        cells[idx].dataset.level = level;
        cells[idx].className = 'cell cell-' + level;
      }
    });
    updateContributionCount();
  }, 50);
});

(function initYearSelect() {
  for (let y = 2025; y >= 2010; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
  yearSelect.value = 2025;
  displayYear.textContent = 2025;
})();

function getLastDayOfYear(year) {
  return new Date(year, 11, 31);
}
function getNumberOfWeeks(year) {
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  const millisecondsBetween = lastDay - firstDay;
  const daysBetween = millisecondsBetween / (1000 * 60 * 60 * 24);
  return Math.ceil((daysBetween + getFirstDayOfYear(year) + 1) / 7);
}
function updateContributionCount() {
  let count = 0;
  document.querySelectorAll('.cell').forEach(cell => {
    const level = parseInt(cell.dataset.level || '0', 10);
    count += level;
  });
  contributionCount.textContent = `${count} contributions in ${displayYear.textContent}`;
}
function positionMonthLabels(year) {
  monthLabels.innerHTML = '';
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const firstDayOffset = getFirstDayOfYear(year);
  months.forEach((month, index) => {
    const firstDayOfMonth = new Date(year, index, 1);
    const daysSinceJan1 = Math.floor((firstDayOfMonth - new Date(year, 0, 1)) / (24 * 60 * 60 * 1000));
    let columnPosition = Math.floor((daysSinceJan1 + firstDayOffset) / 7);
    if (index === 0) columnPosition = 0;
    const lbl = document.createElement('div');
    lbl.classList.add('month-label');
    lbl.textContent = month;
    lbl.style.left = `${columnPosition * 13}px`;
    monthLabels.appendChild(lbl);
  });
}
function buildCalendar(year) {
  displayYear.textContent = year;
  heatmap.innerHTML = '';
  positionMonthLabels(year);
  const numWeeks = getNumberOfWeeks(year);
  const firstDayOffset = getFirstDayOfYear(year);
  heatmap.style.gridTemplateColumns = `repeat(${numWeeks}, 11px)`;
  for (let week = 0; week < numWeeks; week++) {
    for (let day = 0; day < 7; day++) {
      const dayOffset = week * 7 + day - firstDayOffset;
      const date = new Date(year, 0, 1);
      date.setDate(date.getDate() + dayOffset);
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.date = date.toISOString().slice(0, 10);
      cell.dataset.level = '0';
      cell.style.gridColumn = week + 1;
      cell.style.gridRow = day + 1;
      if (date.getFullYear() !== parseInt(year)) {
        cell.style.visibility = 'hidden';
      }
      cell.title = `${date.toDateString()}`;
      cell.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateCell(cell);
        e.preventDefault();
      });
      cell.addEventListener('mouseenter', () => {
        if (isDragging) {
          updateCell(cell);
        }
      });
      heatmap.appendChild(cell);
    }
  }
  updateContributionCount();
}
function updateCell(cell) {
  if (cell.style.visibility !== 'hidden') {
    cell.dataset.level = selectedLevel;
    cell.className = 'cell';
    if (selectedLevel > 0) {
      cell.classList.add(`cell-${selectedLevel}`);
    }
    updateContributionCount();
  }
}
document.addEventListener('mouseup', () => {
  isDragging = false;
});
buildCalendar(parseInt(yearSelect.value));
yearSelect.addEventListener('change', () => {
  buildCalendar(parseInt(yearSelect.value));
  presetSelect.value = '';
});
clearBtn.addEventListener('click', () => {
  buildCalendar(parseInt(yearSelect.value));
  presetSelect.value = '';
});
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'escape' || key === 'esc') {
    buildCalendar(parseInt(yearSelect.value));
    presetSelect.value = '';
    return;
  }
  if (key === ' ' || key === 'spacebar') {
    selectedLevel = 0;
    colorButtons.forEach(b => b.classList.remove('selected'));
    document.querySelector('.color-button[data-level="0"]').classList.add('selected');
  } else if (key === 'a') {
    selectedLevel = 1;
    colorButtons.forEach(b => b.classList.remove('selected'));
    document.querySelector('.color-button[data-level="1"]').classList.add('selected');
  } else if (key === 's') {
    selectedLevel = 2;
    colorButtons.forEach(b => b.classList.remove('selected'));
    document.querySelector('.color-button[data-level="2"]').classList.add('selected');
  } else if (key === 'd') {
    selectedLevel = 3;
    colorButtons.forEach(b => b.classList.remove('selected'));
    document.querySelector('.color-button[data-level="3"]').classList.add('selected');
  } else if (key === 'f') {
    selectedLevel = 4;
    colorButtons.forEach(b => b.classList.remove('selected'));
    document.querySelector('.color-button[data-level="4"]').classList.add('selected');
  }
});
colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLevel = parseInt(btn.dataset.level, 10);
    colorButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
exampleProfileBtn.addEventListener('click', () => {
  window.open('https://github.com/YunggiAlyana?tab=overview&from=2024-12-01&to=2024-12-31');
});
exampleScriptBtn.addEventListener('click', () => {
  const sampleScript = `#!/bin/bash
echo 'GENERATING ART...'
REPO_URL="https://github.com/username/repo"
echo "Using repository: $REPO_URL"
rm -rf github_painter
mkdir github_painter
cd github_painter
git init
git remote add origin "$REPO_URL"
git pull origin main || echo "Repository may be empty or not exist yet"
touch foobar.txt
# Creating commits for contribution graph
# ... commits would be here ...
echo "Pushing to: $REPO_URL"
git remote -v
git push -u origin main --force
echo 'DONE!'`;
  alert(sampleScript);
});
githubIssuesBtn.addEventListener('click', () => {
  window.open('https://github.com/YunggiAlyana/Contribution-painter/issues');
});
starBtn.addEventListener('click', () => {
  window.open('https://github.com/YunggiAlyana/Contribution-painter');
});
function getRandomHour() {return Math.floor(Math.random() * 8) + 9;}
function getRandomMinute() {return Math.floor(Math.random() * 60);}
function getRandomSecond() {return Math.floor(Math.random() * 60);}
generateBtn.addEventListener('click', () => {
  if (!repoUrl.value) {
    alert("Please enter a GitHub repository URL");
    return;
  }
  let repoUrlValue = repoUrl.value.trim();
  if (repoUrlValue.endsWith('/')) repoUrlValue = repoUrlValue.slice(0, -1);
  if (!repoUrlValue.match(/^https?:\/\/github\.com\/[\w-]+\/[\w-]+$/)) {
    alert("Please enter a valid GitHub repository URL in the format: https://github.com/username/repo without .git");
    return;
  }
  const year = parseInt(yearSelect.value, 10);
  let bash = "#!/bin/bash\n";
  bash += "echo 'GENERATING GITHUB CONTRIBUTION ART...'\n";
  bash += "# Ensure correct repo URL\n";
  bash += `REPO_URL=\"${repoUrlValue}\"\n`;
  bash += "echo \"Using repository: $REPO_URL\"\n\n";
  bash += "# Extract repository name from URL\n";
  bash += "REPO_NAME=$(echo $REPO_URL | sed 's/.*github.com\\///g')\n";
  bash += "echo \"Repository name: $REPO_NAME\"\n\n";
  bash += "# Prepare directory\n";
  bash += "rm -rf github_painter_tmp\n";
  bash += "mkdir github_painter_tmp\n";
  bash += "cd github_painter_tmp\n";
  bash += "git init\n";
  bash += "git remote add origin \"$REPO_URL\"\n";
  bash += "git pull origin main || git pull origin master || echo \"Repository may be empty or not exist yet\"\n";
  bash += "echo \"Art generated by github-painter\" > README.md\n";
  bash += "git add README.md\n";
  bash += "git commit -m \"Initialize repository for GitHub art\"\n\n";
  bash += "# Creating commits for contribution graph\n";
  const activeCells = Array.from(document.querySelectorAll(".cell"))
    .filter(cell => cell.style.visibility !== 'hidden' && parseInt(cell.dataset.level || '0', 10) > 0)
    .sort((a, b) => a.dataset.date.localeCompare(b.dataset.date));
  const usedTimestamps = new Set();
  activeCells.forEach(cell => {
    const level = parseInt(cell.dataset.level || '0', 10);
    if (level > 0 && cell.dataset.date) {
      const [y, m, d] = cell.dataset.date.split('-');
      const yearNum = parseInt(y, 10);
      const monthNum = parseInt(m, 10);
      const dayNum = parseInt(d, 10) + 1;
      for (let j = 0; j < level; j++) {
        let hour = getRandomHour();
        let minute = getRandomMinute();
        let second = getRandomSecond();
        let dateObj = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, hour, minute, second));
        let timeString = dateObj.toISOString();
        while (usedTimestamps.has(timeString)) {
          second = (second + 1) % 60;
          minute = second === 0 ? (minute + 1) % 60 : minute;
          hour = minute === 0 && second === 0 ? (hour + 1) % 24 : hour;
          dateObj = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, hour, minute, second));
          timeString = dateObj.toISOString();
        }
        usedTimestamps.add(timeString);
        bash += `echo '${timeString}' >> foobar.txt\n`;
        bash += `git add foobar.txt\n`;
        bash += `GIT_AUTHOR_DATE='${timeString}' GIT_COMMITTER_DATE='${timeString}' git commit -m 'Update at ${timeString}'\n`;
      }
    }
  });
  bash += "\n# Push changes to repository\n";
  bash += "echo \"Pushing to: $REPO_URL\"\n";
  bash += "git branch -M main\n";
  bash += "git remote -v\n";
  bash += "git push -u origin main --force\n";
  bash += "cd ..\n";
  bash += "rm -rf github_painter_tmp\n";
  bash += "echo 'DONE! Check your GitHub profile to see the contribution graph art.'\n";
  const blob = new Blob([bash], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'github_painter.sh';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  console.log('Generated script:', bash);
});
