'use client';
import { useEffect } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { FaChevronLeft } from 'react-icons/fa';
// Удалены неиспользуемые импорты
// import { FaAnglesRight } from 'react-icons/fa6';
// import { FaAnglesLeft } from 'react-icons/fa6';

const FIRSTNAMES = [
  'John',
  'Steve',
  'Marc',
  'Franklin',
  'Isaac',
  'Vincent',
  'Edwin',
  'Ashlyn',
  'Anthony',
  'Alia',
  'Abby',
  'Francesca',
];

const LASTNAMES = [
  '87:20',
  '12:21',
  '31:21',
  '77:40',
  '84:20',
  '48:20',
  '144:50',
  '21:26',
  '55:51',
  '43:21',
  '43:57',
  '55:41',
  '23:50',
];

const TITLES = [
  'CEO',
  'President',
  'Vice President',
  'Director',
  'Manager',
  'Developer',
];

// Удалено неиспользуемое значение BTN_WIDTH
// const BTN_WIDTH = 4;

const TableRating = () => {
  useEffect(() => {
    // Initialization logic when component mounts
    initCopies();
    initAutoLimits();
    initAutoIncrements();
    initAutoFirstnames();
    initAutoLastnames();
    initAutoTitles();
    initAutoIntegers();
    initPaginations();

    // Cleanup logic if needed
    return () => {
      // Cleanup logic here
    };
  }, []); // Добавьте зависимости, если необходимо

  function initCopies() {
    const targets = [...document.querySelectorAll('*[data-copy]')];

    targets.reverse().forEach((original) => {
      const amountString = original.getAttribute('data-copy');

      if (amountString !== null) {
        const amount = parseInt(amountString, 10);

        // Check if original has a parent node before proceeding
        if (original.parentNode !== null) {
          for (let i = 0; i < amount; i++) {
            const copy = original.cloneNode(true);
            original.parentNode.insertBefore(copy, original.nextSibling);
          }
        } else {
          console.error('Parent node is null for element:', original);
        }
      }
    });
  }

  function initAutoIncrements() {
    const autos = document.querySelectorAll('.auto-increment');

    autos.forEach((auto, i) => {
      auto.innerHTML = `${i + 1}`;
    });
  }

  const rand = (a: number, b: number) => Math.floor(Math.random() * b + a);

  function initAutoFirstnames() {
    const autos = document.querySelectorAll('.auto-firstname');

    autos.forEach((auto) => {
      auto.innerHTML = FIRSTNAMES[rand(0, FIRSTNAMES.length)];
    });
  }

  function initAutoLastnames() {
    const autos = document.querySelectorAll('.auto-lastname');

    autos.forEach((auto) => {
      auto.innerHTML = LASTNAMES[rand(0, LASTNAMES.length)];
    });
  }

  function initAutoTitles() {
    const autos = document.querySelectorAll('.auto-title');

    autos.forEach((auto) => {
      auto.innerHTML = TITLES[rand(0, TITLES.length)];
    });
  }

  function initAutoIntegers() {
    const autos = document.querySelectorAll('.auto-integer');

    autos.forEach((auto) => {
      const minString = auto.getAttribute('min');
      const maxString = auto.getAttribute('max');

      // Check if minString and maxString are not null before parsing
      if (minString !== null && maxString !== null) {
        const min = parseInt(minString);
        const max = parseInt(maxString);

        // Check if min and max are not NaN
        if (!isNaN(min) && !isNaN(max)) {
          auto.innerHTML = rand(min, max).toString(); // Convert result to string
        } else {
          console.error('Invalid min or max value:', minString, maxString);
        }
      } else {
        console.error('min or max attribute is missing for element:', auto);
      }
    });
  }

  function initPaginations() {
    const paginations = document.querySelectorAll('.pagination');

    paginations.forEach((pagination) => {
      const tableId = pagination.getAttribute('data-table');
      if (tableId !== null) {
        const table = document.getElementById(tableId);
        pagination.setAttribute('data-x', '0');
        if (table !== null) {
          const tableContainer = pagination.closest('.table-container');
          if (tableContainer !== null) {
            createPagination(pagination as HTMLElement, table as HTMLElement); // Type assertion here
          } else {
            console.error(
              "No ancestor with class 'table-container' found for pagination:",
              pagination
            );
          }
        }
      }
    });
  }

  function createPagination(pagination: HTMLElement, table: HTMLElement): void {
    const limit = parseInt(table.getAttribute('data-limit') || '10');
    const rows = table.querySelectorAll('.table-row:not(.table-heading)');
    const page_count = Math.ceil(rows.length / limit);
    console.log(page_count);
    for (let i = 0; i < page_count; i++) {
      const new_button = document.createElement('li');
      new_button.innerHTML = '<span>' + (i + 1) + '</span>';

      if (i === 0) new_button.classList.add('active');

      pagination.appendChild(new_button);

      new_button.addEventListener('click', () => {
        switchPage(pagination, table, i);
      });
    }

    updatePaginationInfos(pagination, table, page_count, 0);
    initPaginationExtremes(pagination, table, page_count);
  }

  function switchPage(
    pagination: HTMLElement,
    table: HTMLElement,
    index: number,
    bypass: number = -1
  ): void {
    const BTN_WIDTH = 4;
    const limit = parseInt(table.getAttribute('data-limit') || '10');
    const rows = table.querySelectorAll('.table-row:not(.table-heading)');
    const buttons = pagination.querySelectorAll('li');
    const last_active = pagination.querySelector('li.active');
    const x_pos = parseInt(pagination.getAttribute('data-x') || '0');
    let x_shift = 0;
    const target_pos = (-index + 2) * BTN_WIDTH;
    const page_count = Math.ceil(rows.length / limit);

    if (bypass !== -1) {
      x_shift = (-bypass + 2) * BTN_WIDTH;
    } else {
      if (index > 1 && index < buttons.length - 2) {
        x_shift = target_pos;
      } else if (index === 1) {
        x_shift = 0;
      } else if (index === page_count - 2) {
        x_shift = (-page_count + 5) * BTN_WIDTH;
      } else {
        x_shift = x_pos;
      }
    }

    rows.forEach((row, row_index) => {
      if (row_index < index * limit || row_index >= index * limit + limit) {
        (row as HTMLElement).style.display = 'none'; // Narrowing down the type to HTMLElement
      } else {
        (row as HTMLElement).style.display = 'flex'; // Narrowing down the type to HTMLElement
        (row as HTMLElement).style.opacity = '0'; // Narrowing down the type to HTMLElement

        setTimeout(() => {
          (row as HTMLElement).style.opacity = '1'; // Narrowing down the type to HTMLElement
        }, 50);
      }
    });

    last_active?.classList.remove('active');
    buttons[index]?.classList.add('active');
    pagination.style.transform = 'translateX(' + x_shift + 'rem)';
    pagination.setAttribute('data-x', x_shift.toString());

    updatePaginationInfos(pagination, table, page_count, index);
    updatePaginationProgress(pagination, index, page_count - 1);
  }

  function updatePaginationInfos(
    pagination: HTMLElement,
    table: HTMLElement,
    page_count: number,
    index: number
  ): void {
    const info = pagination
      .closest('.pagination-container')
      ?.querySelector('.pagination-info');

    if (info === null || info === undefined) return;

    let from = 0,
      to = 0;
    const rows = table.querySelectorAll('.table-row:not(.table-heading)');
    let started = false;

    for (let i = 1; i < rows.length; i++) {
      const display = (rows[i - 1] as HTMLElement).style.display;

      if (display !== 'none' && !started) {
        started = true;
        from = i;
      } else if ((display === 'none' && started) || i == rows.length - 1) {
        to = i == rows.length - 1 ? rows.length : i - 1;
        break;
      }
    }

    info.innerHTML =
      'Displaying ' +
      from +
      '-' +
      to +
      ' on page ' +
      (index + 1) +
      '/' +
      page_count;
  }

  function initPaginationExtremes(
    pagination: HTMLElement,
    table: HTMLElement,
    max: number
  ): void {
    const container = pagination.closest('.pagination-container') as HTMLElement;
    const left = container?.querySelector('.pagination-left');
    const right = container?.querySelector('.pagination-right');

    if (left !== null && left !== undefined) {
      left.addEventListener('click', () => {
        switchPage(pagination, table, 0, Math.min(2, max - 1));
      });
    }

    if (right !== null && right !== undefined) {
      right.addEventListener('click', () => {
        switchPage(pagination, table, max - 1, Math.max(0, max - 3));
      });
    }

    initPaginationSteppedExtremes(pagination, table, container, max);
  }

  function initPaginationSteppedExtremes(
    pagination: HTMLElement,
    table: HTMLElement,
    container: HTMLElement,
    max: number
  ): void {
    const left = container?.querySelector(
      '.pagination-left-one'
    ) as HTMLLIElement;
    const right = container?.querySelector(
      '.pagination-right-one'
    ) as HTMLLIElement;

    if (left !== null && left !== undefined) {
      left.addEventListener('click', () => {
        const last_active = pagination.querySelector(
          'li.active'
        ) as HTMLLIElement;
        const buttons = pagination.querySelectorAll('li');
        const last_index = Array.from(buttons).indexOf(last_active);

        if (last_index > 0) switchPage(pagination, table, last_index - 1);
      });
    }

    if (right !== null && right !== undefined) {
      right.addEventListener('click', () => {
        const last_active = pagination.querySelector(
          'li.active'
        ) as HTMLLIElement;
        const buttons = pagination.querySelectorAll('li');
        const last_index = Array.from(buttons).indexOf(last_active);

        if (last_index < max - 1) switchPage(pagination, table, last_index + 1);
      });
    }
  }

  function updatePaginationProgress(
    pagination: HTMLElement,
    index: number,
    total: number
  ): void {
    const dot = pagination
      .closest('.table-container')
      ?.querySelector('.progress-point') as HTMLElement;

    if (dot !== null) {
      dot.style.left = (index / total) * 100 + '%';
    }
  }

  function initAutoLimits(): void {
    const table_containers = document.querySelectorAll('.table-container');
    const limit = window.innerHeight / 70;

    table_containers.forEach((container: Element) => {
      const table = container.querySelector('.table');

      container.setAttribute('style', '--data-limit: ' + limit);
      table?.setAttribute('data-limit', limit.toString());
    });
  }

  return (
    <div className='mx-auto w-[90%] px-0 pb-8'>
      <div className='table-container mx-auto md:w-full'>
        <div className='table' id='table-0' data-limit='9'>
          {/* Table headings */}
          <div className='table-heading table-row'>
            {/* <div className="table-col">
				#
			</div> */}
            <div className='table-col'>Profile</div>
            <div className='table-col'>Online time</div>
            {/* <div className="table-col">
				Title
			</div> */}
            {/* <div className="table-col">
				Completed
			</div> */}
          </div>

          {/* Table data rows */}
          <div className='table-row' data-copy='10'>
            {/* <div className="table-col">
				<span className="auto-increment">0</span>
			</div> */}
            <div className='table-col'>
              <span className='auto-firstname'></span>
            </div>
            <div className='table-col'>
              <span className='auto-lastname'></span>
            </div>
            {/* <div className="table-col">
				<span className="auto-title"></span>
			</div> */}
          </div>
        </div>

        {/* Pagination container */}
        <div className='pagination-container'>
          <div className='flex'>
            <div className='d-flex flex-fill justify-content-center'>
              <div className='pagination-wrapper'>
                <ul className='pagination' data-table='table-0'></ul>
              </div>
            </div>
            <span className='pagination-info !hidden'></span>
            <div className='flex items-center justify-center'>
              {/* <button className="pagination-extreme pagination-left">
                <FaAnglesLeft />
			</button> */}
              <button className='pagination-extreme pagination-left-one'>
                <FaChevronLeft />
              </button>

              <button className='pagination-extreme pagination-right-one'>
                <FaChevronRight />
              </button>
              {/* <button className="pagination-extreme pagination-right">
				<FaAnglesRight />
			</button> */}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className='progress-bar'>
          <div className='progress-point'></div>
        </div>
      </div>
    </div>
  );
};

export default TableRating;
