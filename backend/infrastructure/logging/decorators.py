"""Decoradores para logging automático."""

import functools
import inspect
import time
import asyncio
from typing import Any, Callable
from infrastructure.logging import get_logger

logger = get_logger("decorators")


def log_execution(
    include_args: bool = False, include_result: bool = False, log_level: str = "DEBUG"
):
    """
    Decorador que registra la ejecución de métodos/funciones, soporta async y sync.

    Args:
        include_args: Si incluir los argumentos en el log
        include_result: Si incluir el resultado en el log
        log_level: Nivel de log (DEBUG, INFO, WARNING, ERROR)
    """

    def decorator(func: Callable) -> Callable:
        is_coroutine = asyncio.iscoroutinefunction(func)

        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            func_name = func.__name__
            class_name = (
                f"{args[0].__class__.__name__}."
                if args and hasattr(args[0], "__class__")
                else ""
            )

            args_info = ""
            if include_args and (args or kwargs):
                display_args = args[1:] if class_name else args
                args_str = ", ".join([repr(arg) for arg in display_args])
                kwargs_str = ", ".join([f"{k}={repr(v)}" for k, v in kwargs.items()])
                all_args = ", ".join(filter(None, [args_str, kwargs_str]))
                args_info = f"({all_args})" if all_args else "()"

            getattr(logger, log_level.lower())(f"→ {class_name}{func_name}{args_info}")

            start_time = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                duration = time.perf_counter() - start_time

                result_info = (
                    f" -> {type(result).__name__}"
                    if include_result and result is not None
                    else ""
                )
                getattr(logger, log_level.lower())(
                    f"← {class_name}{func_name}{result_info} ({duration:.3f}s)"
                )
                return result

            except Exception as e:
                duration = time.perf_counter() - start_time
                logger.error(
                    f"✗ {class_name}{func_name} failed: {str(e)} ({duration:.3f}s)"
                )
                raise

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            func_name = func.__name__
            class_name = (
                f"{args[0].__class__.__name__}."
                if args and hasattr(args[0], "__class__")
                else ""
            )

            args_info = ""
            if include_args and (args or kwargs):
                display_args = args[1:] if class_name else args
                args_str = ", ".join([repr(arg) for arg in display_args])
                kwargs_str = ", ".join([f"{k}={repr(v)}" for k, v in kwargs.items()])
                all_args = ", ".join(filter(None, [args_str, kwargs_str]))
                args_info = f"({all_args})" if all_args else "()"

            getattr(logger, log_level.lower())(f"→ {class_name}{func_name}{args_info}")

            start_time = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                duration = time.perf_counter() - start_time

                result_info = (
                    f" -> {type(result).__name__}"
                    if include_result and result is not None
                    else ""
                )
                getattr(logger, log_level.lower())(
                    f"← {class_name}{func_name}{result_info} ({duration:.3f}s)"
                )
                return result

            except Exception as e:
                duration = time.perf_counter() - start_time
                logger.error(
                    f"✗ {class_name}{func_name} failed: {str(e)} ({duration:.3f}s)"
                )
                raise

        return async_wrapper if is_coroutine else sync_wrapper

    return decorator


def log_performance(threshold_seconds: float = 1.0):
    """
    Decorador que registra métodos que tardan más de un umbral específico.
    Soporta funciones async y sync.
    """

    def decorator(func: Callable) -> Callable:
        is_coroutine = asyncio.iscoroutinefunction(func)

        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = await func(*args, **kwargs)
            duration = time.perf_counter() - start

            if duration > threshold_seconds:
                class_name = (
                    f"{args[0].__class__.__name__}."
                    if args and hasattr(args[0], "__class__")
                    else ""
                )
                logger.warning(
                    f"⚠️  SLOW EXECUTION: {class_name}{func.__name__} took {duration:.3f}s "
                    f"(threshold: {threshold_seconds}s)"
                )
            return result

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            duration = time.perf_counter() - start

            if duration > threshold_seconds:
                class_name = (
                    f"{args[0].__class__.__name__}."
                    if args and hasattr(args[0], "__class__")
                    else ""
                )
                logger.warning(
                    f"⚠️  SLOW EXECUTION: {class_name}{func.__name__} took {duration:.3f}s "
                    f"(threshold: {threshold_seconds}s)"
                )
            return result

        return async_wrapper if is_coroutine else sync_wrapper

    return decorator
